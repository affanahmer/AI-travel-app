from fastapi import APIRouter, HTTPException, Depends
from app.services.db import get_database
from app.core.clerk_auth import get_current_user
from app.models.user_model import UserPreferences
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/profile")
async def get_profile(clerk_id: str = Depends(get_current_user)):
    """Fetches user info & ML preferences from MongoDB."""
    db = get_database()
    user = await db.users.find_one({"clerk_id": clerk_id})
    
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    user["_id"] = str(user["_id"])
    return user

@router.put("/preferences")
async def update_preferences(
    preferences: UserPreferences,
    clerk_id: str = Depends(get_current_user)
):
    """Updates ML preferences for the authenticated user."""
    db = get_database()
    
    result = await db.users.update_one(
        {"clerk_id": clerk_id},
        {"$set": {"preferences": preferences.model_dump()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    return {"message": "Preferences updated successfully"}
