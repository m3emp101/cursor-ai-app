# MERN To-Do App

A full-stack to-do application built with MongoDB, Express, React, and Node.js. The backend offers a REST API for managing tasks, and the frontend provides a modern interface for creating, tracking, and completing them.

## Project Structure

```
.
??? backend       # Express + MongoDB API
??? frontend      # Vite + React single-page app
??? README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)

## Backend Setup (`/backend`)

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create an `.env` file based on `.env.example` and update the MongoDB connection string as needed:

   ```bash
   cp .env.example .env
   # Edit .env to set MONGODB_URI and PORT if desired
   ```

3. Start the API server:

   ```bash
   npm run dev   # uses nodemon for hot reload
   # or npm start
   ```

4. The API will be available at `http://localhost:5000` by default.

### REST API

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| GET    | `/api/todos`     | List all to-dos        |
| POST   | `/api/todos`     | Create a new to-do     |
| PUT    | `/api/todos/:id` | Update title/completed |
| DELETE | `/api/todos/:id` | Remove a to-do         |

Example payloads:

```json
// POST /api/todos
{ "title": "Buy groceries" }

// PUT /api/todos/:id
{ "title": "Updated title", "completed": true }
```

## Frontend Setup (`/frontend`)

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file to point the UI to the backend API (optional if you use the default `http://localhost:5000`):

   ```bash
   cp .env.example .env
   # Adjust VITE_API_BASE_URL if the backend runs elsewhere
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open the URL shown in the terminal (typically `http://localhost:5173`). The UI uses CORS to communicate with the backend.

## Development Tips

- Ensure MongoDB is running before starting the backend.
- The frontend offers quick task edits via the *Edit* button (browser `prompt`), completion toggles, and deletions.
- Use the *Refresh* button in the UI if the database changes outside the app.

## Building for Production

- Backend: deploy the Express app to your Node hosting provider, set `MONGODB_URI` and `PORT` environment variables.
- Frontend: run `npm run build` inside `/frontend` and host the generated `dist` folder on a static site provider. Update `VITE_API_BASE_URL` (or configure a reverse proxy) so the SPA can reach the deployed API.

## License

This project is provided as-is for educational purposes. Customize it to suit your needs.
