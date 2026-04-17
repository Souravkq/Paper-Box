#  Paper Box

> **AI-powered government subsidy discovery platform** — helping every Indian citizen find and apply for benefits they deserve.

![Paper Box Banner](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini-purple?style=for-the-badge)

---

## 🌐 Overview

Paper Box is a full-stack MERN application that simplifies access to government subsidies. Users can discover, understand, and apply for schemes based on their profile (Student, Farmer, Business Owner, or General Citizen) with the help of an AI chatbot powered by Google Gemini.

---

##  Features

| Feature | Description |
|--------|-------------|
| 🔐 Auth | JWT-based login/register with role-based access |
| 🎯 Personalization | Schemes recommended based on user type |
| 🔍 Smart Search | Real-time autocomplete with user-type prioritization |
| 🤖 AI Chatbot | Floating Gemini-powered assistant |
| 📊 Dashboards | User & Admin dashboards |
| ⭐ Feedback | Star rating + community reviews |
| 🌙 Dark Mode | Persisted dark/light theme toggle |
| 📱 Responsive | Mobile-first design |

---

##  Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally on `mongodb://localhost:27017`

### 1. Clone & Install

```bash
git clone <repo-url>
cd paperbox

# Install all dependencies
npm run install:all
```

### 2. Configure Environment

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/paperbox
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free Gemini API key at: https://makersuite.google.com/app/apikey

### 3. Start MongoDB

```bash
# macOS / Linux
mongod

# Windows
mongod --dbpath C:\data\db
```

### 4. Run the App

```bash
# Run both server + client together
npm install  # installs concurrently
npm run dev
```

Or separately:
```bash
# Terminal 1 - Backend
npm run server     # runs on http://localhost:5000

# Terminal 2 - Frontend
npm run client     # runs on http://localhost:5173
```

### 5. First Launch

On first start, the server **auto-seeds**:
- ✅ 12 real government schemes
- ✅ 4 sample user reviews
- ✅ Admin account: `admin@paperbox.com` / `admin123`

---

## 📁 Project Structure

```
paperbox/
├── server/                    # Express + MongoDB Backend
│   ├── index.js               # Entry point
│   ├── .env                   # Environment variables
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Scheme.js          # Scheme schema
│   │   └── Feedback.js        # Feedback schema
│   ├── routes/
│   │   ├── users.js           # Auth + profile APIs
│   │   ├── schemes.js         # CRUD + recommended
│   │   ├── feedback.js        # Reviews API
│   │   ├── search.js          # Smart search + suggestions
│   │   └── chat.js            # Gemini AI proxy
│   ├── middleware/
│   │   └── auth.js            # JWT + admin guard
│   └── utils/
│       └── seed.js            # Database seeder
│
└── client/                    # React + Vite Frontend
    ├── src/
    │   ├── App.jsx            # Router + layout
    │   ├── main.jsx           # Entry point
    │   ├── index.css          # Design system
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   ├── api.js         # Axios instance
    │   │   └── categories.js  # Category helpers
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx + .css
    │   │   │   └── Footer.jsx + .css
    │   │   └── common/
    │   │       ├── SearchBar.jsx + .css
    │   │       ├── SchemeCard.jsx + .css
    │   │       ├── Chatbot.jsx + .css
    │   │       └── SkeletonCard.jsx + .css
    │   └── pages/
    │       ├── Home.jsx + .css
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── Auth.css
    │       ├── Schemes.jsx + .css
    │       ├── SchemeDetail.jsx + .css
    │       ├── Dashboard.jsx + .css
    │       ├── AdminDashboard.jsx + .css
    │       ├── About.jsx + .css
    │       ├── Services.jsx + .css
    │       └── Contact.jsx + .css
```

---

##  API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/register` | POST | Register new user |
| `/api/users/login` | POST | Login |
| `/api/users/profile` | GET | Get user profile (auth) |
| `/api/users/all` | GET | List all users (admin) |
| `/api/schemes` | GET | List schemes |
| `/api/schemes/recommended` | GET | Personalized (auth) |
| `/api/schemes/:id` | GET/PUT/DELETE | Single scheme CRUD |
| `/api/search?q=&category=` | GET | Smart search |
| `/api/search/suggestions?q=` | GET | Autocomplete |
| `/api/feedback` | GET/POST | Reviews |
| `/api/chat` | POST | Gemini AI chat |

---

##  User Roles

| Role | Access |
|------|--------|
| **Admin** | Full CRUD on schemes, user list, feedback management |
| **User** | Browse, search, view schemes, chatbot, feedback |

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Pure CSS with custom design system |
| Backend | Node.js, Express.js |
| Database | MongoDB (local), Mongoose ODM |
| Auth | JWT (JSON Web Tokens) |
| AI | Google Gemini API |
| Notifications | react-hot-toast |

---

##  Notes

- The app works fully without the Gemini API key — the chatbot falls back to a helpful message
- MongoDB must be running locally before starting the server
- Dark mode preference is persisted in localStorage
- The seed script only runs once — it checks if data exists first

---

##  Built For

- Hackathons & Ideathons
- Government tech projects
- Portfolio showcase
- Real-world civic tech deployment
- College Project

---

