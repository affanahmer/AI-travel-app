from pydantic import BaseModel, Field
from typing import List, Optional

class DestinationBase(BaseModel):
    name: str
    type: str # Adventure, Relaxation, etc.
    region: str
    cost: int
    weather: str
    best_season: str
    activities: List[str]
    safety_rating: int = Field(ge=1, le=5)
    user_rating: float = Field(ge=1.0, le=5.0)
    image: str
    description: Optional[str] = ""

class DestinationCreate(DestinationBase):
    pass

class DestinationDB(DestinationBase):
    id: Optional[str] = Field(alias="_id")

    class Config:
        populate_by_name = True
