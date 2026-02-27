import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any
from app.models.destination_model import DestinationDB
from app.models.user_model import UserPreferences

def get_recommendations(user_prefs: UserPreferences, destinations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Personalized recommendations using Content-Based Filtering.
    """
    if not destinations:
        return []

    # If user has no preferences, return by rating (cold start)
    if not user_prefs.travel_styles and (user_prefs.budget_range[0] == 0 and user_prefs.budget_range[1] == 1000000):
        return sorted(destinations, key=lambda x: x.get('user_rating', 0), reverse=True)

    # 1. Prepare Data
    df = pd.DataFrame(destinations)
    
    # Create a "features" string for each destination
    # Combining type, region, weather, activities
    df['features'] = df.apply(lambda x: f"{x['type']} {x['region']} {x['weather']} {' '.join(x['activities'])}", axis=1)
    
    # 2. Create User Profile Feature String
    user_feature = " ".join(user_prefs.travel_styles)
    
    # 3. Vectorize
    tfidf = TfidfVectorizer(stop_words='english')
    # Combine user feature with destination features for a common vocabulary
    all_features = df['features'].tolist() + [user_feature]
    tfidf_matrix = tfidf.fit_transform(all_features)
    
    # 4. Calculate Similarity
    # The last row is the user profile
    user_vector = tfidf_matrix[-1]
    dest_vectors = tfidf_matrix[:-1]
    
    cosine_sim = cosine_similarity(user_vector, dest_vectors).flatten()
    
    # 5. Combine with other factors (Budget, Rating)
    # Filter by budget first
    min_b, max_b = user_prefs.budget_range
    df['sim_score'] = cosine_sim
    
    # Simple score: 70% similarity, 20% rating, 10% budget proximity
    # For now, let's just use similarity and filter by budget
    mask = (df['cost'] >= min_b) & (df['cost'] <= max_b)
    final_df = df[mask].copy()
    
    if final_df.empty:
        # If no destinations match budget, return all sorted by similarity
        final_df = df.copy()

    # Calculate final score
    final_df['final_score'] = (final_df['sim_score'] * 0.7) + (final_df['user_rating'] / 5.0 * 0.3)
    
    result_df = final_df.sort_values(by='final_score', ascending=False)
    
    # Convert back to list of dicts, including original fields
    recommended = result_df.drop(columns=['features', 'sim_score', 'final_score']).to_dict('records')
    
    # Ensure _id is string
    for r in recommended:
        if '_id' in r:
            r['_id'] = str(r['_id'])
            
    return recommended
