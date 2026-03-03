from pydantic import BaseModel, Field
from typing import Dict, Optional
from datetime import datetime

class BudgetBreakdown(BaseModel):
    hotel: int
    travel: int
    meals: int
    total: int

class QueryParameters(BaseModel):
    days: int
    budget: int

class TripBase(BaseModel):
    user_id: str
    destination_id: str
    query_parameters: dict = Field(default_factory=dict)
    budget_breakdown: BudgetBreakdown

class TripCreate(TripBase):
    pass

class TripDB(TripBase):
    id: Optional[str] = Field(alias="_id")
    saved_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
