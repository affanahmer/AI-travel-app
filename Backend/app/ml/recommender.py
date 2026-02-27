import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
from typing import List, Dict, Any, Optional
from app.models.user_model import UserPreferences
import logging

logger = logging.getLogger(__name__)


def _build_feature_text(dest: Dict[str, Any]) -> str:
    """
    Build a rich text feature string for TF-IDF from multiple destination attributes.
    The more descriptive the text, the better the similarity matching.
    """
    parts = [
        dest.get("type", ""),
        dest.get("region", ""),
        dest.get("weather", ""),
        dest.get("best_season", ""),
        " ".join(dest.get("activities", [])),
        dest.get("description", ""),  # New: richer content for TF-IDF
    ]
    return " ".join(parts).lower()


def _build_user_profile(user_prefs: UserPreferences, query_dest: str = "") -> str:
    """
    Build user profile text for TF-IDF matching.
    Combines stated preferences with query-extracted destination hints.
    """
    parts = list(user_prefs.travel_styles)
    if query_dest:
        parts.append(query_dest)
    return " ".join(parts).lower()


def _compute_cost_score(cost: float, min_budget: float, max_budget: float) -> float:
    """
    Score destinations by how well their cost fits the user's budget.
    Perfect fit (cost in range) = 1.0
    Under budget = slight bonus (0.8-1.0)
    Over budget = penalty based on how far over
    """
    if max_budget <= 0:
        return 0.5  # No budget preference

    if min_budget <= cost <= max_budget:
        return 1.0
    elif cost < min_budget:
        return 0.8  # Under budget is okay but not ideal
    else:
        # Over budget — penalize proportionally
        overshoot = (cost - max_budget) / max_budget
        return max(0.0, 1.0 - overshoot * 2)


def get_recommendations(
    user_prefs: UserPreferences,
    destinations: List[Dict[str, Any]],
    query_destination: str = "",
    num_results: int = 10,
) -> List[Dict[str, Any]]:
    """
    Advanced recommendation engine using multi-signal scoring:

    1. Content Similarity (TF-IDF + Cosine) — matches user style to destinations
    2. Rating Score — higher rated destinations are preferred
    3. Safety Score — safer destinations get a slight boost
    4. Budget Fit — destinations within budget score higher
    5. Query Match — direct name/region matching from NLP query

    For guest users (no preferences), falls back to popularity-based ranking.
    """
    if not destinations:
        return []

    # ── Cold-Start: No preferences at all ──
    has_preferences = bool(user_prefs.travel_styles) or (
        user_prefs.budget_range[0] > 0 or user_prefs.budget_range[1] < 1000000
    )

    if not has_preferences and not query_destination:
        # Pure cold-start: rank by popularity (rating * safety)
        return sorted(
            destinations,
            key=lambda x: (x.get("user_rating", 0) * 0.7 + x.get("safety_rating", 0) * 0.3),
            reverse=True,
        )[:num_results]

    # ── Build DataFrame ──
    df = pd.DataFrame(destinations)

    # ── Signal 1: TF-IDF Content Similarity ──
    df["features"] = df.apply(lambda x: _build_feature_text(x.to_dict()), axis=1)
    user_profile = _build_user_profile(user_prefs, query_destination)

    sim_scores = np.zeros(len(df))
    if user_profile.strip():
        try:
            tfidf = TfidfVectorizer(stop_words="english", max_features=500)
            all_features = df["features"].tolist() + [user_profile]
            tfidf_matrix = tfidf.fit_transform(all_features)

            user_vec = tfidf_matrix[-1]
            dest_vecs = tfidf_matrix[:-1]
            sim_scores = cosine_similarity(user_vec, dest_vecs).flatten()
        except Exception as e:
            logger.warning(f"TF-IDF failed: {e}")

    df["sim_score"] = sim_scores

    # ── Signal 2: Rating Score (normalized 0-1) ──
    df["rating_score"] = df["user_rating"].fillna(0) / 5.0

    # ── Signal 3: Safety Score (normalized 0-1) ──
    df["safety_score"] = df["safety_rating"].fillna(0) / 5.0

    # ── Signal 4: Budget Fit Score ──
    min_b, max_b = user_prefs.budget_range
    df["budget_score"] = df["cost"].apply(lambda c: _compute_cost_score(c, min_b, max_b))

    # ── Signal 5: Direct Query Match (bonus for name/region match) ──
    query_bonus = np.zeros(len(df))
    if query_destination:
        q_lower = query_destination.lower()
        for i, row in df.iterrows():
            name = str(row.get("name", "")).lower()
            region = str(row.get("region", "")).lower()
            if q_lower in name or name in q_lower:
                query_bonus[i] = 1.0  # Exact name match
            elif q_lower in region or region in q_lower:
                query_bonus[i] = 0.6  # Region match
            # Check for partial word overlap
            elif any(word in name for word in q_lower.split() if len(word) > 3):
                query_bonus[i] = 0.4
    df["query_bonus"] = query_bonus

    # ── Combine Signals with Weighted Formula ──
    # Weights tuned for best user experience:
    # - Content similarity is king (35%) for personalized recs
    # - Budget fit is critical (25%) — users care about affordability
    # - Direct query match (20%) — NLP-extracted destination should be prioritized
    # - Rating (12%) — social proof matters
    # - Safety (8%) — practical consideration
    weights = {
        "sim_score": 0.35,
        "budget_score": 0.25,
        "query_bonus": 0.20,
        "rating_score": 0.12,
        "safety_score": 0.08,
    }

    df["final_score"] = sum(df[col] * weight for col, weight in weights.items())

    # Sort by final score
    result_df = df.sort_values(by="final_score", ascending=False).head(num_results)

    # ── Clean up and return ──
    drop_cols = ["features", "sim_score", "rating_score", "safety_score",
                 "budget_score", "query_bonus", "final_score"]
    result_df = result_df.drop(columns=[c for c in drop_cols if c in result_df.columns])

    recommended = result_df.to_dict("records")
    for r in recommended:
        if "_id" in r:
            r["_id"] = str(r["_id"])

    return recommended
