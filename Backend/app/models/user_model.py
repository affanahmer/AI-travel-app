from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


class UserPreferences(BaseModel):
    budget_range: List[int] = Field(default=[0, 1000000])
    travel_styles: List[str] = Field(default=[])
    preferred_duration: int = Field(default=3)


class UserRegister(BaseModel):
    """Request body for user registration."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """Request body for user login."""
    email: EmailStr
    password: str


class UserBase(BaseModel):
    """Base user stored in MongoDB."""
    email: EmailStr
    name: str
    role: str = "user"
    password_hash: str = ""
    preferences: UserPreferences = Field(default_factory=UserPreferences)
    search_history: List[str] = Field(default=[])
    created_at: datetime = Field(default_factory=lambda: datetime.now())


class UserResponse(BaseModel):
    """User data returned to the frontend (no password)."""
    id: str
    email: str
    name: str
    role: str = "user"
    preferences: UserPreferences = Field(default_factory=UserPreferences)
    search_history: List[str] = Field(default=[])
    created_at: Optional[str] = None
