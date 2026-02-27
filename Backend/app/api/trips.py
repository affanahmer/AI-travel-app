from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.services.db import get_database
from app.models.trip_model import TripCreate, TripDB, BudgetBreakdown
from app.core.clerk_auth import get_current_user
from bson import ObjectId

router = APIRouter()

@router.post("/calculate")
async def calculate_budget(payload: dict):
    """Dynamic budget estimation — public endpoint."""
    destination_id = payload.get("destination_id")
    days = payload.get("days", 1)
    
    if not destination_id:
        raise HTTPException(status_code=400, detail="destination_id is required")
    
    if not ObjectId.is_valid(destination_id):
        raise HTTPException(status_code=400, detail="Invalid destination_id")
    
    db = get_database()
    dest = await db.destinations.find_one({"_id": ObjectId(destination_id)})
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    # Budget estimation logic based on destination base cost
    base_cost = dest.get("cost", 5000)
    
    hotel_per_day = int(base_cost * 0.4)
    meals_per_day = int(base_cost * 0.2)
    travel_fixed = int(base_cost * 0.4)
    
    hotel = hotel_per_day * days
    meals = meals_per_day * days
    travel = travel_fixed
    total = hotel + meals + travel
    
    return {
        "destination": dest.get("name", "Unknown"),
        "days": days,
        "hotel": hotel,
        "travel": travel,
        "meals": meals,
        "total": total
    }

@router.post("/save")
async def save_trip(
    payload: dict,
    clerk_id: str = Depends(get_current_user)
):
    """Saves generated trip to user profile — requires Clerk JWT."""
    db = get_database()
    
    trip_data = {
        "clerk_id": clerk_id,
        "destination_id": payload.get("destination_id"),
        "query_parameters": payload.get("query_parameters", {}),
        "budget_breakdown": payload.get("budget_breakdown", {}),
    }
    
    from datetime import datetime
    trip_data["saved_at"] = datetime.utcnow()
    
    result = await db.saved_trips.insert_one(trip_data)
    saved_trip = await db.saved_trips.find_one({"_id": result.inserted_id})
    saved_trip["_id"] = str(saved_trip["_id"])
    
    return saved_trip

@router.get("/my-trips")
async def get_my_trips(clerk_id: str = Depends(get_current_user)):
    """Get logged-in user's saved trips — requires Clerk JWT."""
    db = get_database()
    cursor = db.saved_trips.find({"clerk_id": clerk_id})
    trips = await cursor.to_list(length=100)
    
    for trip in trips:
        trip["_id"] = str(trip["_id"])
        
    return trips

@router.delete("/my-trips/{trip_id}")
async def delete_trip(
    trip_id: str,
    clerk_id: str = Depends(get_current_user)
):
    """Delete a saved trip — requires Clerk JWT."""
    db = get_database()
    if not ObjectId.is_valid(trip_id):
        raise HTTPException(status_code=400, detail="Invalid trip ID")
    
    result = await db.saved_trips.delete_one({
        "_id": ObjectId(trip_id),
        "clerk_id": clerk_id  # Ensure users can only delete their own trips
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    return {"message": "Trip deleted successfully"}
