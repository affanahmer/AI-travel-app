from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.services.db import connect_to_mongo, close_mongo_connection
from app.api import destinations, search, trips, users
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup and shutdown events."""
    logger.info("Starting up — connecting to MongoDB...")
    await connect_to_mongo()
    logger.info("MongoDB connected successfully")
    yield
    logger.info("Shutting down — closing MongoDB connection...")
    await close_mongo_connection()
    logger.info("MongoDB connection closed")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered travel companion API with NLP search, ML recommendations, and budget estimation.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router,        prefix="/api/users",           tags=["Users & Auth"])
app.include_router(destinations.router, prefix="/api/destinations",    tags=["Destinations"])
app.include_router(search.router,       prefix="/api/search",          tags=["Search & AI"])
app.include_router(trips.router,        prefix="/api/trips",           tags=["Trips & Budget"])

@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "Welcome to the AI Travel Companion API",
        "docs": "/docs",
        "version": "1.0.0",
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}
