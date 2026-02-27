# Comprehensive Backend Architecture & Specifications

This document outlines the complete backend structure located inside the `Backend/` directory of your monorepo. It is designed using  **Python (FastAPI)** ,  **MongoDB (Self-Hosted)** , integrates  **Clerk for Authentication** , and uses  **Machine Learning (scikit-learn/spaCy)** .

## 1. Backend Folder Structure

A modular, highly scalable folder structure inside `AI-Travel-agent/Backend/`:

```
Backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI instance, CORS setup, and Clerk Middleware
│   ├── core/                   # App-wide settings and configurations
│   │   ├── config.py           # Env vars (MONGODB_URL, CLERK_SECRET_KEY, WEBHOOK_SECRET)
│   │   └── clerk_auth.py       # FastAPI dependency to verify Clerk JWTs
│   ├── api/                    # API Routers (Endpoints)
│   │   ├── webhooks.py         # Clerk Webhook receiver (syncs users to MongoDB)
│   │   ├── users.py            # Profile and preference management
│   │   ├── destinations.py     # CRUD for destinations (Admin/Public)
│   │   ├── search.py           # NLP search query handling
│   │   └── trips.py            # Budget calculation and saving trips
│   ├── models/                 # Pydantic schemas (Data validation)
│   │   ├── user_model.py
│   │   ├── destination_model.py
│   │   └── trip_model.py
│   ├── services/               # Business logic and Database Operations
│   │   └── db.py               # MongoDB Async Motor client setup
│   └── ml/                     # Artificial Intelligence & Machine Learning
│       ├── nlp_parser.py       # spaCy script to extract Days, Budget, Location
│       ├── recommender.py      # scikit-learn Content/Collaborative filtering logic
│       └── model_weights/      # (Optional) Pre-trained ML models/Pickle files
├── .env                        # Local environment variables
├── requirements.txt            # Python dependencies
└── Dockerfile                  # Instructions to containerize the Python backend

```

## 2. Database & Clerk Authentication Setup

This section details how the external services are connected to your FastAPI backend.

### MongoDB Setup (`app/services/db.py`)

We use `motor` (the async Python driver for MongoDB) to ensure the FastAPI application remains non-blocking.

* **Initialization:** On FastAPI startup (`@app.on_event("startup")`), the Motor client connects using the `MONGODB_URL` from the `.env` file.
* **Connection:** `client = AsyncIOMotorClient(settings.MONGODB_URL)`
* **Database Object:** `db = client.travel_db`
* Collections are accessed asynchronously: `await db.users.find_one(...)`.

### Clerk Authentication Setup (`app/core/clerk_auth.py`)

Since Clerk handles user registration, login, and passwords on the frontend, the backend only needs to verify who is making the API request.

* **JWT Verification:** When the Next.js frontend calls a protected backend route, it passes the Clerk Session Token as a `Bearer` token in the Authorization header.
* **FastAPI Dependency:** We create a dependency `get_current_user` that uses the Clerk Python SDK (or `PyJWT` with Clerk's JWKS URL) to decode the token. If valid, it extracts the `clerk_id`.
* **Syncing Users (Webhooks):** Since the DB needs user preferences for AI, we use a Webhook (`/api/webhooks/clerk`). When a user signs up on the frontend via Clerk, Clerk sends a `user.created` POST request to our backend, and we insert a new document into our MongoDB `users` collection.

## 3. MongoDB Database Models (Schemas)

Since MongoDB is NoSQL, these represent the JSON document structures stored in your self-hosted database collections.

### Collection: `users`

Synced with Clerk via webhooks. Passwords are NO LONGER stored here.

```
{
  "_id": "ObjectId('...')",
  "clerk_id": "String (e.g., 'user_2xyz...')", // Primary identifier from Clerk
  "email": "String (Unique)",
  "name": "String",
  "role": "String (Enum: 'user', 'admin')", 
  "preferences": {
    "budget_range": "Array [min, max]",
    "travel_styles": "Array of Strings (e.g., ['Adventure', 'Nature'])",
    "preferred_duration": "Integer (Days)"
  },
  "created_at": "ISODate"
}

```

### Collection: `destinations`

The core dataset. Must include exactly the attributes specified in the assignment.

```
{
  "_id": "ObjectId('...')",
  "name": "String (e.g., 'Hunza Valley')",
  "type": "String (e.g., 'Adventure', 'Relaxation')",
  "region": "String",
  "cost": "Integer (Average cost in PKR)",
  "weather": "String (e.g., 'Cool', 'Warm')",
  "best_season": "String",
  "activities": "Array of Strings (e.g., ['Hiking', 'Photography'])",
  "safety_rating": "Integer (1-5)",
  "user_rating": "Float (1.0-5.0)",
  "image": "String (URL or file path)"
}

```

### Collection: `saved_trips`

Stores the customized trip plan generated by the AI and the Budget Estimator.

```
{
  "_id": "ObjectId('...')",
  "clerk_id": "String", // Links back to the user
  "destination_id": "ObjectId('...')", // Foreign key mapping to destination
  "query_parameters": {
    "days": "Integer",
    "budget": "Integer"
  },
  "budget_breakdown": {
    "hotel": "Integer",
    "travel": "Integer",
    "meals": "Integer",
    "total": "Integer"
  },
  "saved_at": "ISODate"
}

```

## 4. Comprehensive API Endpoints List

These endpoints define the communication contract. Note that Login/Register are gone, replaced by Clerk infrastructure.

### 🔐 Clerk Webhooks & Users (`/api/webhooks`, `/api/users`)

| **Method** | **Endpoint**         | **Auth Req?**       | **Description**                                            | **Payload (Body/Query)**       | **Response**                    |
| ---------------- | -------------------------- | ------------------------- | ---------------------------------------------------------------- | ------------------------------------ | ------------------------------------- |
| `POST`         | `/api/webhooks/clerk`    | Clerk Signature           | Receives `user.created`event from Clerk to create a DB profile | Clerk Webhook Event JSON             | `200 OK`                            |
| `GET`          | `/api/users/profile`     | **Yes (Clerk JWT)** | Fetches user info & ML preferences from Mongo                    | *Bearer Token*                     | User DB object                        |
| `PUT`          | `/api/users/preferences` | **Yes (Clerk JWT)** | Updates ML preferences                                           | `{budget_range, travel_styles...}` | `{message: "Updated successfully"}` |

### 🔍 NLP & Search (`/api/search`)

| **Method** | **Endpoint**    | **Auth Req?** | **Description**                                    | **Payload (Body/Query)**               | **Response**                                       |
| ---------------- | --------------------- | ------------------- | -------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------- |
| `POST`         | `/api/search/parse` | No                  | Processes natural language search string using `spaCy` | `{"query": "3 days in north under 25000"}` | `{"destination": "north", "days": 3, "budget": 25000}` |

### 🤖 AI Recommendations (`/api/recommendations`)

| **Method** | **Endpoint**                | **Auth Req?** | **Description**                                                     | **Payload (Body/Query)** | **Response**                                    |
| ---------------- | --------------------------------- | ------------------- | ------------------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------- |
| `POST`         | `/api/recommendations/generate` | Optional            | Triggers ML models (Cold-start for guests, Content-based if JWT provided) | `{ parsed_parameters }`      | Array of matched `destination`objects sorted by AI. |

### 📍 Destinations (Public & Admin) (`/api/destinations`)

| **Method** | **Endpoint**         | **Auth Req?** | **Description**             | **Payload (Body/Query)**    | **Response**              |
| ---------------- | -------------------------- | ------------------- | --------------------------------- | --------------------------------- | ------------------------------- |
| `GET`          | `/api/destinations`      | No                  | Fetch all (with optional filters) | `?region=Punjab&type=Adventure` | Array of `destination`objects |
| `GET`          | `/api/destinations/{id}` | No                  | Fetch single destination          | *URL Param ID*                  | Single `destination`object    |
| `POST`         | `/api/destinations`      | **Admin JWT** | Create new destination            | Complete destination JSON         | Created object + ID             |
| `PUT`          | `/api/destinations/{id}` | **Admin JWT** | Update pricing/seasonality        | Partial destination JSON          | Updated object                  |

### 💰 Budget & Trips (`/api/trips`)

| **Method** | **Endpoint**       | **Auth Req?**       | **Description**           | **Payload (Body/Query)**               | **Response**                            |
| ---------------- | ------------------------ | ------------------------- | ------------------------------- | -------------------------------------------- | --------------------------------------------- |
| `POST`         | `/api/trips/calculate` | No                        | Dynamic budget estimation       | `{destination_id, days}`                   | `{hotel: X, travel: Y, meals: Z, total: T}` |
| `POST`         | `/api/trips/save`      | **Yes (Clerk JWT)** | Saves generated trip to profile | `{destination_id, days, budget_breakdown}` | Saved trip object                             |
| `GET`          | `/api/trips/my-trips`  | **Yes (Clerk JWT)** | Get logged-in user's trips      | *Bearer Token*                             | Array of saved trips                          |

## 5. AI / ML Implementation Details (Inside `ml/` folder)

* **`nlp_parser.py` (Search Bar Parsing):**
  Uses `spaCy` to process the user's string. Identifies monetary values (Budget), dates/durations (Days), and geographical entities (Regions).
* **`recommender.py` (Recommendation Engine):**
  * **Guest Users (Cold-Start):** If no Clerk JWT is provided, the script queries MongoDB to find destinations where `cost <= extracted_budget`, sorting the results by `user_rating` and `safety_rating`.
  * **Logged-in Users (Content-Based Filtering):** If a Clerk JWT is verified, the system fetches the user's preferences from MongoDB. It uses `sklearn.feature_extraction.text.TfidfVectorizer` to calculate the `cosine_similarity` between the user's preference vector and destination vectors to return highly personalized matches.
