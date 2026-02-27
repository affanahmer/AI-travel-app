import asyncio
import httpx
import json
import os

sample_destinations = [
    {
        "name": "Hunza Valley",
        "type": "Adventure",
        "region": "Gilgit Baltistan",
        "cost": 25000,
        "weather": "Cool",
        "best_season": "Summer",
        "activities": ["Hiking", "Sightseeing", "Photography"],
        "safety_rating": 5,
        "user_rating": 4.8,
        "image": "https://images.unsplash.com/photo-1581452140409-cf2b828fcb0a?auto=format&fit=crop&q=80&w=1000"
    },
    {
        "name": "Gwadar Beach",
        "type": "Relaxation",
        "region": "Balochistan",
        "cost": 18000,
        "weather": "Warm",
        "best_season": "Winter",
        "activities": ["Swimming", "Sunbathing", "Boat Ride"],
        "safety_rating": 4,
        "user_rating": 4.5,
        "image": "https://images.unsplash.com/photo-1621370258197-89e473bf9e6f?auto=format&fit=crop&q=80&w=1000"
    },
    {
        "name": "Murree",
        "type": "Family",
        "region": "Punjab",
        "cost": 15000,
        "weather": "Cold",
        "best_season": "All Year",
        "activities": ["Shopping", "Cable Car", "Hiking"],
        "safety_rating": 4,
        "user_rating": 4.3,
        "image": "https://images.unsplash.com/photo-1541818780211-1da39f150426?auto=format&fit=crop&q=80&w=1000"
    },
    {
        "name": "Naran Kaghan",
        "type": "Nature",
        "region": "Khyber Pakhtunkhwa",
        "cost": 20000,
        "weather": "Cold",
        "best_season": "Summer",
        "activities": ["Rafting", "Lakes", "Trekking"],
        "safety_rating": 5,
        "user_rating": 4.7,
        "image": "https://images.unsplash.com/photo-1589139209706-6963f23f8510?auto=format&fit=crop&q=80&w=1000"
    },
     {
        "name": "Mohenjo-daro",
        "type": "Historical",
        "region": "Sindh",
        "cost": 12000,
        "weather": "Hot",
        "best_season": "Winter",
        "activities": ["Sightseeing", "History", "Museum"],
        "safety_rating": 4,
        "user_rating": 4.2,
        "image": "https://images.unsplash.com/photo-1601334976725-b7470f7cf43f?auto=format&fit=crop&q=80&w=1000"
    }
]

async def seed_data():
    # Try to load from the data folder first
    destinations = sample_destinations
    try:
        json_path = "../data/destinations.json"
        if os.path.exists(json_path):
            with open(json_path, 'r') as f:
                destinations = json.load(f)
                print("Loaded destinations from JSON file")
    except Exception as e:
        print(f"Note: Could not load JSON file, using fallbacks. {e}")

    async with httpx.AsyncClient() as client:
        for dest in destinations:
            try:
                response = await client.post("http://localhost:8000/api/destinations/", json=dest)
                if response.status_code == 200:
                    print(f"Successfully added: {dest['name']}")
                else:
                    print(f"Failed to add {dest['name']}: {response.text}")
            except Exception as e:
                print(f"Error connecting to backend: {e}")

if __name__ == "__main__":
    asyncio.run(seed_data())
