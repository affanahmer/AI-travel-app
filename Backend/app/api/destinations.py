from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.db import get_database
from app.models.destination_model import DestinationDB, DestinationCreate
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[DestinationDB])
async def get_destinations(
    region: Optional[str] = None,
    type: Optional[str] = None,
    max_cost: Optional[int] = None
):
    db = get_database()
    query = {}
    if region:
        query["region"] = region
    if type:
        query["type"] = type
    if max_cost:
        query["cost"] = {"$lte": max_cost}
    
    cursor = db.destinations.find(query)
    destinations = await cursor.to_list(length=100)
    
    # Convert ObjectId to string
    for dest in destinations:
        dest["_id"] = str(dest["_id"])
        
    return destinations

@router.get("/{id}", response_model=DestinationDB)
async def get_destination(id: str):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    dest = await db.destinations.find_one({"_id": ObjectId(id)})
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    dest["_id"] = str(dest["_id"])
    return dest

@router.post("/", response_model=DestinationDB)
async def create_destination(destination: DestinationCreate):
    db = get_database()
    result = await db.destinations.insert_one(destination.model_dump())
    
    created_dest = await db.destinations.find_one({"_id": result.inserted_id})
    created_dest["_id"] = str(created_dest["_id"])
    return created_dest

@router.put("/{id}", response_model=DestinationDB)
async def update_destination(id: str, destination: dict):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    existing = await db.destinations.find_one({"_id": ObjectId(id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    await db.destinations.update_one({"_id": ObjectId(id)}, {"$set": destination})
    
    updated = await db.destinations.find_one({"_id": ObjectId(id)})
    updated["_id"] = str(updated["_id"])
    return updated

@router.delete("/{id}")
async def delete_destination(id: str):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    result = await db.destinations.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    return {"message": "Destination deleted successfully"}
