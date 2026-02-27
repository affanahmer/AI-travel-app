from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class UserPreferences(BaseModel):
    budget_range: List[int] = Field(default=[0, 1000000])
    travel_styles: List[str] = Field(default=[])
    preferred_duration: int = Field(default=3)

class UserBase(BaseModel):
    clerk_id: str
    email: EmailStr
    name: str
    role: str = "user"
    preferences: UserPreferences = Field(default_factory=UserPreferences)

class UserCreate(UserBase):
    pass

class UserDB(UserBase):
    id: Optional[str] = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
