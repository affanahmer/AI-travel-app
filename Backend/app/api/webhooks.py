from fastapi import APIRouter, Request, HTTPException, Header
from svix.webhooks import Webhook
from app.core.config import settings
from app.services.db import get_database
from app.models.user_model import UserCreate
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/clerk")
async def clerk_webhook(
    request: Request,
    svix_id: str = Header(None, alias="svix-id"),
    svix_signature: str = Header(None, alias="svix-signature"),
    svix_timestamp: str = Header(None, alias="svix-timestamp"),
):
    if not settings.WEBHOOK_SECRET:
        logger.warning("WEBHOOK_SECRET is not set. Skipping verification.")
        # In production, this should be mandatory
    
    payload = await request.body()
    
    if settings.WEBHOOK_SECRET:
        wh = Webhook(settings.WEBHOOK_SECRET)
        try:
            headers = {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp,
            }
            wh.verify(payload, headers)
        except Exception as e:
            logger.error(f"Webhook verification failed: {e}")
            raise HTTPException(status_code=400, detail="Invalid signature")

    data = await request.json()
    event_type = data.get("type")

    if event_type == "user.created":
        user_data = data.get("data", {})
        email = user_data.get("email_addresses", [{}])[0].get("email_address")
        clerk_id = user_data.get("id")
        first_name = user_data.get("first_name", "")
        last_name = user_data.get("last_name", "")
        name = f"{first_name} {last_name}".strip()

        db = get_database()
        new_user = UserCreate(
            clerk_id=clerk_id,
            email=email,
            name=name
        )
        
        await db.users.insert_one(new_user.model_dump())
        logger.info(f"User created: {clerk_id}")

    return {"status": "success"}
