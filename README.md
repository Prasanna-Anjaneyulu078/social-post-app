# 3W Social — Mini Social Post Application

A responsive MERN stack social media post application built for the 3W Full Stack Internship Assignment. Inspired by the TaskPlanet app, it features a mobile-first UI for real-time social interaction.

## Features

- **Account Creation**: Simple signup and login with email and password
- **Database Integration**: Securely store user details and posts in MongoDB Atlas
- **Flexible Posting**: Users can post text, images, or both (neither field is mandatory)
- **Public Feed**: A unified stream where all posts from all users are visible
- **Instant Interactions**: Likes and comments reflect instantly in the UI without page reloads
- **Engagement Tracking**: Displays total counts and saves usernames of contributors
- **Mobile-First Design**: Responsive and optimized layout built with React Bootstrap

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | Core UI library |
| React Bootstrap | Responsive layout and components |
| Lucide React | Consistent iconography |
| js-cookie | JWT and user session storage |
| Axios | API communication and interceptors |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server and REST API |
| MongoDB + Mongoose | Database (2 collections: Users, Posts) |
| jsonwebtoken | JWT generation and verification |
| Multer | Middleware for image upload handling |
| CORS | Cross-origin resource sharing |

## Project Structure

```
Social-post-app/
│
├── frontend/                    React.js application
│   ├── public/                  Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreatePost/      Post creation form
│   │   │   └── PostCard/        Individual post with interactions
│   │   ├── pages/
│   │   │   ├── Feed/            Public feed layout
│   │   │   ├── Login/           User authentication page
│   │   │   └── Signup/          User registration page
│   │   ├── services/
│   │   │   └── api.js           Axios instance & API endpoints
│   │   ├── App.jsx              Routes and global state
│   │   ├── App.css              Global styles
│   │   ├── index.css            Global CSS
│   │   └── main.jsx             React entry point
│   ├── .env                     Environment variables
│   ├── .gitignore               Git ignore rules
│   ├── eslint.config.js         ESLint configuration
│   ├── index.html               HTML template
│   ├── package.json             Frontend dependencies
│   ├── package-lock.json        Dependency lock file
│   └── vite.config.js           Vite configuration
│
└── backend/                     Node.js + Express API
    ├── config/
    │   ├── cloudinary.js        Cloudinary configuration
    │   └── db.js                MongoDB connection setup
    ├── controllers/
    │   ├── authController.js    Signup & login logic
    │   └── postController.js    CRUD & interactions logic
    ├── middleware/
    │   ├── authMiddleware.js    JWT protection logic
    │   └── uploadMiddleware.js  Multer + Cloudinary setup
    ├── models/
    │   ├── Post.js              Post schema
    │   └── User.js              User schema
    ├── routes/
    │   ├── authRoutes.js        /api/auth/* endpoints
    │   └── postRoutes.js        /api/posts/* endpoints
    ├── .env                     Environment variables
    ├── package.json             Backend dependencies
    ├── package-lock.json        Dependency lock file
    └── server.js                Express entry point
```

## Getting Started

### Prerequisites
- Node.js v16 or higher
- MongoDB Atlas account
- Cloudinary account (for image upload)

### Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start server:
```bash
npm start
```

Backend runs on `http://localhost:5000`

### Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Reference

### Auth Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Create account; returns JWT |
| POST | `/api/auth/login` | Public | Authenticate user; returns JWT |

### Post Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/posts` | JWT | View all posts from all users |
| POST | `/api/posts` | JWT | Create text/image post |
| PUT | `/api/posts/:id/like` | JWT | Toggle like on a post |
| POST | `/api/posts/:id/comment` | JWT | Add comment to a post |

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository on Vercel
3. Set environment variable: `VITE_API_BASE_URL=your_backend_url/api`
4. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create Web Service on Render
3. Set environment variables (MONGO_URI, JWT_SECRET, CLOUDINARY_*)
4. Deploy

### Database (MongoDB Atlas)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free tier cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string for MONGO_URI

## Security Features

- **JWT Authentication**: Token-based authentication for protected routes
- **Protected Routes**: Only authenticated users can create/edit/delete posts
- **Bcrypt.js**: Secure password hashing for stored credentials
- **CORS**: Configured to allow only approved origins

---
