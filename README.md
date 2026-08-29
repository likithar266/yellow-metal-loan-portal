# Yellow Metal - Full-Stack Developer Intern Assignment

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation
1. Clone the repository and navigate to the project directory.

2. Install dependencies for the backend and frontend:
```bash
cd backend
npm install
cd ../frontend
npm install
```

3. Start both development servers concurrently. We recommend opening two terminal tabs.

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```
The backend API will run on `http://localhost:5000`. By default, it runs an in-memory MongoDB instance (`mongodb-memory-server`) to ensure zero-setup execution. You can also provide a `MONGO_URI` in `.env`.

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
The frontend UI will run on `http://localhost:3000`.

### Features
- Backend REST API (Node.js & Express) with Mongoose model validation.
- Frontend Next.js app with Tailwind v4 (Trust-first financial aesthetic).
- Dynamic loan eligible amount calculations using 75% LTV cap.
- Lead deduplication validation (checks same mobile number in the last 7 days).
- In-memory zero-setup MongoDB out of the box, with cloud scaleability via `.env`.

## Endpoints
- `GET /api/v1/loan-schemes`: Returns available schemes and interest rates.
- `POST /api/v1/leads/submit`: Submit lead form payload for loan offer calculation and deduplication checking.
- `GET /api/v1/leads`: Returns list of all leads.
