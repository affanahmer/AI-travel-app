import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from typing import List

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Travel Companion API"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "travel_db"
    CLERK_SECRET_KEY: str = ""
    WEBHOOK_SECRET: str = ""
    ALLOWED_ORIGINS_STR: str = "http://localhost:3000"
    
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS_STR.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
