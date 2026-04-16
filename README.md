# Emplay — AI Prompt Library

A full-stack web application to store and manage AI image generation prompts. Users can view, create, and explore prompts with a live view counter powered by Redis.

---

## Live Links

| | URL |
|---|---|
| Frontend | https://your-app.vercel.app |
| Backend API | https://your-backend.onrender.com |

> Update these links after deployment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Cache / Counter | Redis |
| Containerization | Docker + Docker Compose |

---

## Features

- View all prompts in a grid layout with complexity badges (Low / Medium / High)
- View full prompt details with a live view count (increments on every visit)
- Add new prompts with a validated form
- Redis-powered real-time view counter using INCR
- Fully containerized with Docker Compose

---

## Project Structure

```
Emplay-Assignment/
├── frontend/                   # React 18 + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── PromptList.jsx      # /prompts — all prompts grid
│   │   │   ├── PromptDetail.jsx    # /prompts/:id — detail + view count
│   │   │   └── AddPrompt.jsx       # /add-prompt — create form
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PromptCard.jsx
│   │   ├── services/
│   │   │   └── api.js              # Axios API calls
│   │   └── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
├── backend/                    # Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   │   └── promptController.js # Business logic
│   │   ├── routes/
│   │   │   └── prompts.js          # API routes
│   │   └── db/
│   │       ├── postgres.js         # PostgreSQL connection
│   │       └── redis.js            # Redis connection
│   │   └── server.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/prompts` | Get all prompts |
| POST | `/prompts` | Create a new prompt |
| GET | `/prompts/:id` | Get single prompt + increment Redis view count |

### POST /prompts — Request Body
```json
{
  "title": "Cyberpunk City",
  "content": "A neon-lit cyberpunk city at night with flying cars and holographic billboards",
  "complexity": 7
}
```

### GET /prompts/:id — Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Cyberpunk City",
    "content": "A neon-lit cyberpunk city at night...",
    "complexity": 7,
    "created_at": "2024-01-01T00:00:00Z",
    "view_count": 42
  }
}
```

### Validation Rules
| Field | Rule |
|---|---|
| title | Required, min 3 characters |
| content | Required, min 20 characters |
| complexity | Required, integer between 1 and 10 |

---

## Architecture

```
Browser (React + Vite)
        |
        | HTTP (via Vite proxy / direct)
        |
Node.js + Express API
        |               |
        |               |
   PostgreSQL         Redis
 (prompt storage)  (view counts)
```

- **PostgreSQL** — Stores all prompt data permanently
- **Redis** — Tracks view count per prompt using INCR (in-memory, fast)
- **Vite Proxy** — Routes `/prompts` requests to backend during development (avoids CORS)

---

## Running Locally (without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL installed and running
- Redis installed and running

### 1. Create PostgreSQL Database
```bash
psql -U postgres
CREATE DATABASE emplay_db;
\q
```

### 2. Configure Environment
Edit `backend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=emplay_db
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Start Backend
```bash
cd backend
npm install
npm run dev
# Runs at http://localhost:5000
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

---

## Running with Docker Compose

Make sure Docker Desktop is running, then:

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| PostgreSQL | localhost:5433 |
| Redis | localhost:6379 |

To stop:
```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| PostgreSQL | Render PostgreSQL |
| Redis | Upstash |

---

## Screenshots

> Add screenshots after deployment.

---

## Assumptions and Trade-offs

- Redis view counts reset on container restart — this is intentional as Redis is used as a fast in-memory counter, not persistent storage
- PostgreSQL data persists via Docker named volume (`postgres_data`)
- Backend validation mirrors frontend validation to protect against direct API calls
- No authentication implemented (listed as a bonus feature in the assignment)
