from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from app.ml.nlp_parser import parse_travel_query
from app.ml.recommender import get_recommendations
from app.models.user_model import UserPreferences
from app.services.db import get_database
from app.core.auth import get_optional_user
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/parse")
async def parse_query(payload: dict):
    """Processes natural language search string using spaCy/regex."""
    query = payload.get("query", "")
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    parsed_data = parse_travel_query(query)
    return parsed_data

@router.post("/recommendations")
async def recommendations(
    payload: dict,
    clerk_id: Optional[str] = Depends(get_optional_user)
):
    """
    Triggers ML models for recommendations.
    - Guest users (no JWT): Cold-start heuristic by rating & budget.
    - Logged-in users (JWT): Content-Based Filtering using preferences.
    """
    query = payload.get("query", "")
    parsed_params = payload.get("params", {})
    
    if query and not parsed_params:
        parsed_params = parse_travel_query(query)
    
    db = get_database()
    
    # Get all destinations from DB
    cursor = db.destinations.find({})
    destinations = await cursor.to_list(length=200)
    
    # Convert ObjectId to string for serialization
    for d in destinations:
        d["_id"] = str(d["_id"])
    
    # Build user preferences
    if clerk_id:
        # Logged-in user: fetch saved preferences from DB
        from bson import ObjectId
        user = await db.users.find_one({"_id": ObjectId(clerk_id)})
        if user and "preferences" in user:
            prefs = user["preferences"]
            user_prefs = UserPreferences(
                budget_range=prefs.get("budget_range", [0, parsed_params.get("budget", 1000000) or 1000000]),
                travel_styles=prefs.get("travel_styles", []),
                preferred_duration=prefs.get("preferred_duration", 3)
            )
        else:
            user_prefs = UserPreferences(
                budget_range=[0, parsed_params.get("budget", 1000000) or 1000000],
                travel_styles=[]
            )
        logger.info(f"Personalized recommendations for user {clerk_id}")
    else:
        # Guest user: cold-start using only query parameters
        user_prefs = UserPreferences(
            budget_range=[0, parsed_params.get("budget", 1000000) or 1000000],
            travel_styles=[]
        )
        logger.info("Guest recommendations (cold-start)")
    
    # Get ML recommendations — pass extracted destination for direct matching
    query_destination = parsed_params.get("destination", "")
    recommended = get_recommendations(user_prefs, destinations, query_destination=query_destination)
    
    return {
        "params": parsed_params,
        "personalized": clerk_id is not None,
        "results": recommended
    }
