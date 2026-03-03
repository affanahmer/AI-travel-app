from fastapi import APIRouter, HTTPException, Depends
from app.services.db import get_database
from app.core.auth import (
    get_current_user,
    hash_password,
    verify_password,
    create_access_token,
)
from app.models.user_model import (
    UserRegister,
    UserLogin,
    UserBase,
    UserPreferences,
    UserResponse,
)
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


# ──────────────── Register ────────────────
@router.post("/register")
async def register(body: UserRegister):
    """Create a new user account."""
    db = get_database()

    # Check if email already exists
    existing = await db.users.find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user document
    user_doc = UserBase(
        email=body.email,
        name=body.name,
        password_hash=hash_password(body.password),
    ).model_dump()

    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    # Generate JWT token
    token = create_access_token(user_id, body.email)

    logger.info(f"User registered: {body.email}")
    return {
        "token": token,
        "user": UserResponse(
            id=user_id,
            email=body.email,
            name=body.name,
        ).model_dump(),
    }


# ──────────────── Login ────────────────
@router.post("/login")
async def login(body: UserLogin):
    """Authenticate and return JWT token."""
    db = get_database()

    user = await db.users.find_one({"email": body.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(body.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])
    token = create_access_token(user_id, body.email)

    logger.info(f"User logged in: {body.email}")
    return {
        "token": token,
        "user": UserResponse(
            id=user_id,
            email=user["email"],
            name=user["name"],
            role=user.get("role", "user"),
            preferences=user.get("preferences", {}),
            search_history=user.get("search_history", []),
            created_at=str(user.get("created_at", "")),
        ).model_dump(),
    }


# ──────────────── Profile ────────────────
@router.get("/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    """Fetches the authenticated user's profile."""
    from bson import ObjectId

    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        role=user.get("role", "user"),
        preferences=user.get("preferences", {}),
        search_history=user.get("search_history", []),
        created_at=str(user.get("created_at", "")),
    ).model_dump()


# ──────────────── Update Preferences ────────────────
@router.put("/preferences")
async def update_preferences(
    preferences: UserPreferences,
    user_id: str = Depends(get_current_user),
):
    """Saves user travel preferences to the database."""
    from bson import ObjectId

    db = get_database()

    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"preferences": preferences.model_dump()}},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    logger.info(f"Preferences updated for user {user_id}")
    return {"message": "Preferences updated successfully", "preferences": preferences.model_dump()}


# ──────────────── Save Search History ────────────────
@router.post("/search-history")
async def save_search(
    body: dict,
    user_id: str = Depends(get_current_user),
):
    """Appends a search query to the user's history."""
    from bson import ObjectId

    query = body.get("query", "")
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")

    db = get_database()
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"search_history": {"$each": [query], "$slice": -20}}},
    )

    return {"message": "Search saved"}
