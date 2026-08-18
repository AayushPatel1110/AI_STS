<div align="center">

# 🔧 Fixora

### AI-Powered Issue Tracking & QA Collaboration Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk)](https://clerk.com)
[![Gemini](https://img.shields.io/badge/AI-Gemini-4285F4?style=flat-square&logo=google)](https://deepmind.google/gemini)

*Turn bug chaos into clarity — powered by AI.*

</div>

---

## ✨ What is Fixora?

Fixora is a full-stack QA issue-tracking platform where reporters can submit technical tickets, developers can pick them up and collaborate, and admins can oversee the entire workflow — all with **AI-powered analysis** on every single ticket via Google Gemini.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Ticket Analysis** | Google Gemini auto-analyzes every ticket for root causes & fix suggestions |
| 👥 **Role-Based Access** | Distinct flows for Reporters, Developers, and Admins |
| 💬 **Real-Time Messaging** | Socket.io-powered DMs with online/offline indicators |
| 🔔 **Live Notifications** | Instant alerts for likes, comments, and ticket assignments |
| 📊 **QA Stats Dashboard** | Live counters — Open, In Progress, Critical, Resolved |
| 🎯 **Developer MyPicks** | Curated queue for developers to manage their assigned issues |
| 🖼️ **Media Attachments** | Upload screenshots & files directly to tickets via Cloudinary |
| 🌙 **Dark / Light Theme** | Glassmorphic UI with smooth theme switching |

---

## 🛠 Tech Stack

### Frontend
- **React 19** — UI library & component architecture
- **Vite** — Lightning-fast build tool & dev server
- **Tailwind CSS v4** — Utility-first styling
- **Zustand** — Lightweight global state management
- **React Router v7** — Client-side navigation & routing
- **Lucide Icons** — Clean, consistent icon set

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — NoSQL database & ODM
- **Socket.io** — Real-time bidirectional communication
- **Clerk** — Authentication, SSO & user management

### AI & Infrastructure
- **Google Gemini** — AI-powered ticket insights
- **Cloudinary** — Media storage & image transformations
- **Vercel** — Frontend hosting & edge deployments
- **Render** — Backend cloud hosting

---

## 📁 Project Structure

```
AI_STS/
├── frontend/               # React + Vite app
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level page components
│       ├── store/          # Zustand state stores
│       ├── lib/            # Utility functions
│       └── providers/      # Context & auth providers
│
└── backend/                # Node.js + Express API
    └── src/
        ├── models/         # Mongoose data models
        ├── controller/     # Route handlers
        ├── routes/         # Express route definitions
        ├── middleware/      # Auth & role guards
        └── lib/            # Shared utilities
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB URI
- Clerk account & API keys
- Google Gemini API key
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/AayushPatel1110/AI_STS.git
cd AI_STS
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=your_admin_email
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
VITE_ADMIN_EMAIL=your_admin_email
```

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🔐 Roles & Permissions

| Role | Capabilities |
|---|---|
| **Reporter/QA** | Create tickets, comment, message developers, react to posts |
| **Developer** | All reporter actions + pick up tickets, update status, MyPicks queue |
| **Admin** | All developer actions + user management, role assignment, platform analytics |

---

## 📸 Pages & Routes

| Route | Page |
|---|---|
| `/` | Home feed — all tickets |
| `/explore` | Search & filter tickets by tech stack |
| `/notifications` | Your activity feed |
| `/messages` | Real-time DMs |
| `/profile` | User profile & activity |
| `/ticket/:id` | Ticket detail with AI analysis |
| `/mypicks` | Developer's assigned ticket queue |
| `/admin` | Admin dashboard & controls |
| `/about` | About the project & creator |

---

## 👤 Author

**Aayush Patel**
- GitHub: [@AayushPatel1110](https://github.com/AayushPatel1110)
- LinkedIn: [aayushpatel1110](https://linkedin.com/in/aayushpatel1110)
- Email: aayushpatel1110@gmail.com

---

<div align="center">
Built with ❤️ by Aayush Patel
</div>
