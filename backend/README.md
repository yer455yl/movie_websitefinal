# 🎬 Movie Website Backend API

A backend REST API for a movie application that allows users to register, authenticate, manage personal movie data, write reviews, and fetch movie information from an external API.

**Tech stack:** Node.js, Express.js, MongoDB, Mongoose, JWT

---

## 📌 Project Overview

This project is a backend application developed as a final assignment.

It demonstrates:
- Secure authentication using JWT
- RESTful API design
- Database modeling with MongoDB & Mongoose
- Protected routes with middleware
- External API integration (OMDb)

The system allows:
- User registration and login
- Secure access to private routes
- Managing user-owned movie data (CRUD)
- Writing personal reviews
- Fetching movie information from an external API

---

## 🧱 Project Structure

```text
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Register & login logic
│   ├── userController.js     # User profile logic
│   ├── movieController.js    # Movie CRUD logic
│   ├── reviewController.js   # Review CRUD logic
│   └── externalController.js # OMDb API integration
├── middleware/
│   ├── authMiddleware.js     # JWT protection middleware
│   └── errorMiddleware.js    # Global error handler
├── models/
│   ├── User.js               # User schema
│   ├── Movie.js              # Movie schema
│   └── Review.js             # Review schema
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── movieRoutes.js
│   ├── reviewRoutes.js
│   └── externalRoutes.js
├── server.js                 # Express app entry point
└── package.json
```

---

## ✅ Setup & Installation

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend/`:

```env
PORT=5050
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
OMDB_API_KEY=your_omdb_api_key
```

3. Run the server:

```bash
npm run dev
```

Server will start at `http://127.0.0.1:5050`.

---

## 📚 API Documentation

### Auth (Public)
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user, returns JWT

### Users (Private)
- `GET /api/users/profile` — Get current user
- `PUT /api/users/profile` — Update user profile

### Movies (Private)
- `POST /api/movies` — Create movie
- `GET /api/movies` — List user movies
- `GET /api/movies/:id` — Get movie by id
- `PUT /api/movies/:id` — Update movie
- `DELETE /api/movies/:id` — Delete movie

### Reviews (Private)
- `POST /api/reviews` — Create review
- `GET /api/reviews` — List reviews (optional: `?movie=<movieId>`)
- `GET /api/reviews/:id` — Get review by id
- `PUT /api/reviews/:id` — Update review
- `DELETE /api/reviews/:id` — Delete review

### External API (Private)
- `GET /api/external/omdb?title=MovieTitle` — Fetch movie info from OMDb

---

## 🚀 Deployment (Render / Railway / Replit)

1. Push your project to GitHub.
2. Create a new service on Render/Railway/Replit.
3. Set environment variables:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `OMDB_API_KEY`
4. Deploy and test that `/api/auth/login` and `/api/movies` respond.
