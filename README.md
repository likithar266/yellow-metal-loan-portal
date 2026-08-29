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
The backend API will run on `http://localhost:5000`. By default, it runs an in-memory MongoDB instance (`mongodb-memory-server`) to ensure zero-setup execution for evaluators. You can also provide a `MONGO_URI` in `.env` if you prefer to use a cloud database.

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
The frontend UI will run on `http://localhost:3000`.

## Navigation & Usage (Frontend)
Once both servers are running, you can access the following pages:

- **Main Intake Portal:** Navigate to `http://localhost:3000/`
  - This is the customer-facing form where users enter their gold collateral details.
  - It features a premium design, dynamic calculations based on the live gold rate (₹7,200/g), and a 75% LTV cap.
  - Submitting this form securely sends the lead to the backend.

- **Admin Dashboard:** Navigate to `http://localhost:3000/admin`
  - This is the internal dashboard for viewing all collected leads.
  - It fetches data from the backend and displays every submitted lead in a clean, tabular format, including customer contact details, gold weight, selected loan scheme, and calculated eligible loan amount.

## Architecture & Features
- **Backend API:** Node.js & Express with strictly typed Mongoose models.
- **Frontend UI:** Next.js 14 App Router styled with Tailwind CSS v4, built with a "Trust-first" luxury financial aesthetic.
- **Deduplication Validation:** The backend automatically checks if the same mobile number submitted a lead within the last 7 days and rejects duplicates.
- **Interactive Motion Canvas:** The frontend utilizes a custom, lightweight HTML5 `<canvas>` integration for a liquid-gold motion background, ensuring high performance without bulky 3D libraries.

## API Endpoints
- `GET /api/v1/loan-schemes`: Returns available schemes and interest rates.
- `POST /api/v1/leads/submit`: Submit lead form payload for loan offer calculation and deduplication checking.
- `GET /api/v1/leads`: Returns a complete list of all collected leads (used by the Admin dashboard).
