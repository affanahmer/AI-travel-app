import asyncio
import httpx
import json
import os

# Comprehensive Pakistan destinations with real Unsplash images
destinations = [
    {
        "name": "Hunza Valley",
        "type": "Adventure",
        "region": "Gilgit Baltistan",
        "cost": 25000,
        "weather": "Cool",
        "best_season": "Summer",
        "activities": ["Hiking", "Sightseeing", "Photography", "Camping"],
        "safety_rating": 5,
        "user_rating": 4.8,
        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        "description": "A breathtaking valley in the Karakoram mountains, famous for Rakaposhi view, Attabad Lake, and the ancient Baltit Fort."
    },
    {
        "name": "Skardu",
        "type": "Adventure",
        "region": "Gilgit Baltistan",
        "cost": 30000,
        "weather": "Cold",
        "best_season": "Summer",
        "activities": ["Trekking", "Camping", "Boating", "Rock Climbing"],
        "safety_rating": 4,
        "user_rating": 4.7,
        "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
        "description": "Gateway to the world's highest peaks. Home to Shangrila Resort, Upper and Lower Kachura Lakes, and Deosai National Park."
    },
    {
        "name": "Gwadar Beach",
        "type": "Relaxation",
        "region": "Balochistan",
        "cost": 18000,
        "weather": "Warm",
        "best_season": "Winter",
        "activities": ["Swimming", "Sunbathing", "Boat Ride", "Fishing"],
        "safety_rating": 4,
        "user_rating": 4.5,
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        "description": "A pristine port city on the Arabian Sea with stunning Hammerhead rock formation and crystal-clear waters."
    },
    {
        "name": "Murree",
        "type": "Family",
        "region": "Punjab",
        "cost": 15000,
        "weather": "Cold",
        "best_season": "All Year",
        "activities": ["Shopping", "Cable Car", "Hiking", "Snow Activities"],
        "safety_rating": 4,
        "user_rating": 4.3,
        "image": "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800&q=80",
        "description": "Pakistan's most popular hill station near Islamabad, perfect for families with its Mall Road and Pindi Point."
    },
    {
        "name": "Lahore Fort",
        "type": "Historical",
        "region": "Punjab",
        "cost": 10000,
        "weather": "Warm",
        "best_season": "Winter",
        "activities": ["Sightseeing", "Photography", "Food Tours", "Museum"],
        "safety_rating": 4,
        "user_rating": 4.6,
        "image": "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80",
        "description": "A UNESCO World Heritage Site showcasing Mughal architecture. Explore Sheesh Mahal, Badshahi Mosque, and the vibrant Food Street."
    },
    {
        "name": "Naran Kaghan",
        "type": "Nature",
        "region": "Khyber Pakhtunkhwa",
        "cost": 20000,
        "weather": "Cold",
        "best_season": "Summer",
        "activities": ["Rafting", "Lakes", "Trekking", "Jeep Safari"],
        "safety_rating": 5,
        "user_rating": 4.7,
        "image": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
        "description": "A scenic valley along the Kunhar River with breathtaking Saif-ul-Malook Lake, Lulusar Lake, and Babusar Pass."
    },
    {
        "name": "Swat Valley",
        "type": "Cultural",
        "region": "Khyber Pakhtunkhwa",
        "cost": 18000,
        "weather": "Moderate",
        "best_season": "Summer",
        "activities": ["Skiing", "Buddhism Sites", "Rafting", "Hiking"],
        "safety_rating": 4,
        "user_rating": 4.5,
        "image": "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80",
        "description": "Known as the Switzerland of the East, Swat offers Malam Jabba ski resort, ancient Buddhist ruins, and lush green valleys."
    },
    {
        "name": "Fairy Meadows",
        "type": "Adventure",
        "region": "Gilgit Baltistan",
        "cost": 22000,
        "weather": "Cool",
        "best_season": "Summer",
        "activities": ["Trekking", "Camping", "Photography", "Stargazing"],
        "safety_rating": 3,
        "user_rating": 4.9,
        "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
        "description": "A stunning alpine meadow at the base of Nanga Parbat — the world's 9th highest peak. The trek is thrilling and rewarding."
    },
    {
        "name": "Mohenjo-daro",
        "type": "Historical",
        "region": "Sindh",
        "cost": 12000,
        "weather": "Hot",
        "best_season": "Winter",
        "activities": ["Sightseeing", "History", "Museum", "Photography"],
        "safety_rating": 4,
        "user_rating": 4.2,
        "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
        "description": "A UNESCO World Heritage Site and one of the earliest urban civilizations dating back to 2500 BCE in the Indus Valley."
    },
    {
        "name": "Neelum Valley",
        "type": "Nature",
        "region": "Azad Kashmir",
        "cost": 20000,
        "weather": "Cool",
        "best_season": "Summer",
        "activities": ["Trekking", "Fishing", "Photography", "Camping"],
        "safety_rating": 4,
        "user_rating": 4.6,
        "image": "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&q=80",
        "description": "A pristine 200km valley along the Neelum River in Azad Kashmir, featuring Ratti Gali Lake and Sharda temple ruins."
    },
    {
        "name": "Chitral",
        "type": "Cultural",
        "region": "Khyber Pakhtunkhwa",
        "cost": 25000,
        "weather": "Cool",
        "best_season": "Summer",
        "activities": ["Polo", "Festivals", "Trekking", "Sightseeing"],
        "safety_rating": 3,
        "user_rating": 4.4,
        "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
        "description": "Home to the Kalash people and their unique culture. Famous for the Shandur Polo Festival and gateway to the Hindu Kush."
    },
    {
        "name": "Islamabad",
        "type": "Family",
        "region": "Islamabad Capital",
        "cost": 12000,
        "weather": "Moderate",
        "best_season": "All Year",
        "activities": ["Hiking", "Museums", "Shopping", "Dining"],
        "safety_rating": 5,
        "user_rating": 4.4,
        "image": "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
        "description": "Pakistan's beautiful capital city. Visit Faisal Mosque, Margalla Hills trails, Lok Virsa Museum, and the serene Rawal Lake."
    }
]


async def update_destinations():
    """Drop existing destinations and re-seed with enhanced data."""
    async with httpx.AsyncClient(timeout=10) as client:
        # First, get existing destinations
        try:
            r = await client.get("http://localhost:8000/api/destinations/")
            existing = r.json()
            # Delete all existing
            for dest in existing:
                await client.delete(f"http://localhost:8000/api/destinations/{dest['_id']}")
                print(f"  Deleted old: {dest['name']}")
        except Exception as e:
            print(f"Note: Could not clear existing ({e})")

        # Now add all new destinations
        print("\nSeeding enhanced destinations...")
        for dest in destinations:
            try:
                r = await client.post("http://localhost:8000/api/destinations/", json=dest)
                if r.status_code == 200:
                    print(f"  ✓ Added: {dest['name']}")
                else:
                    print(f"  ✗ Failed: {dest['name']} — {r.text}")
            except Exception as e:
                print(f"  ✗ Error: {dest['name']} — {e}")

        # Verify
        r = await client.get("http://localhost:8000/api/destinations/")
        total = len(r.json())
        print(f"\n✅ Total destinations in DB: {total}")


if __name__ == "__main__":
    asyncio.run(update_destinations())
