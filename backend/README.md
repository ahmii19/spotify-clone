# Spotify Clone - Backend API

## Tech Stack
- Node.js, Express.js, MongoDB, Mongoose
- JWT Authentication with Refresh Tokens
- Cloudinary for file storage
- Swagger API Documentation

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

### 3. Start development server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Documentation
Swagger docs available at `http://localhost:5000/api-docs`

## Features
- User registration, login, logout with JWT
- Role-based authorization (user/admin)
- Full CRUD for Artists, Albums, Songs, Playlists
- Like/Unlike songs
- Listening history tracking
- Search with pagination, filtering, sorting
- File uploads via Cloudinary
- Input validation
- Central error handling
- Rate limiting
- Security headers (Helmet)
