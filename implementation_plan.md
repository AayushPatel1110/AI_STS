# AI_STS | Developer Support Platform - Implementation Plan

This document outlines the current architecture, implemented features, and technical stack of the **AI_STS** project. It serves as a comprehensive record of the work completed to date.

---

## 🚀 Project Overview
AI_STS is a full-stack technical support ticket system designed for developers. It enables collaborative problem-solving through issue tracking, real-time communication, and developer discovery.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Zustand (State Management), TailwindCSS (Styling), Framer Motion (Animations), React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Real-time** | Socket.io |
| **Authentication** | Clerk (SSO & Email) |
| **Notifications** | Custom API-based notification system |

---

## 🏗 Backend Architecture

### 1. Data Models (`backend/src/models`)
- **User**: Stores Clerk identity, email (synced), role (`user`, `developer`, `admin`), and soft-deletion state (`isDeleted`).
- **Ticket**: Core entity for issues, including status (`open`, `in_progress`, `resolved`, `critical`), description, and assignment tracking.
- **Comment**: Threaded discussions linked to specific tickets.
- **Message**: Personal messaging data for real-time chat.
- **Notification**: Tracks interactions like ticket likes, comments, and status changes.

### 2. Core Controllers (`backend/src/controller`)
- **auth.controller**: Handles user synchronization and automatic `admin` role elevation via `.env` email matching.
- **admin.controller**: Manages global platform statistics, user lists (including soft-deleted), and ticket audits.
- **ticket.controller**: Manages ticket lifecycle, assignment logic, and role filters.
- **message.controller**: Facilitates chat history and message persistence.
- **notification.controller**: CRUD for user-specific alerts.
- **user.controller**: Manages profile updates and developer search.

### 3. Middleware & Security
- **requireAdmin**: Middleware that verifies user roles from the database and supports emergency auto-upgrade for configured admin emails.
- **protectRoute**: standard Clerk-integrated JWT validation.

---

## 💻 Frontend Architecture

### 1. State Management (`frontend/src/store`)
- **useUserStore**: Handles authenticated user state, global profile data, and role synchronization.
- **useAdminStore**: Dedicated store for platform analytics, user management, and ticket audit controls.
- **usePostStore**: Manages ticket lists, detailed ticket state, and filtering.
- **useNotificationStore**: Tracks unread counts and notification history.

### 2. Key Pages & Routes
- **Admin Dashboard (`/admin`)**: Central control hub for platform owners with interactive widgets and advanced filtering.
- **My Picks (`/mypicks`)**: Focused queue for developers to track tickets assigned to them.
- **Home (`/`)**: Dashboard showing trending tickets and recent technical issues.
- **Explore (`/explore`)**: Search interface for filtering tickets by tech stack.
- **Ticket Detail (`/ticket/:id`)**: Comprehensive view for code issues and status transitions.

---

## ✅ Completed Milestones

### **Core Infrastructure**
- [x] Initialized MERN stack with structured folder hierarchy.
- [x] Configured Clerk Auth with secure SSO and immediate state re-syncing.
- [x] Implemented Role-Based Access Control (RBAC) with secure backend middlewares.

### **Admin & Orchestration**
- [x] **Admin Dashboard**: Interactive analytics hub with live-updating metrics.
- [x] **User Management**: Tools for role toggling (`user` ↔ `developer`) and soft-deletes.
- [x] **Ticket Auditing**: Unified search and filter engine for platform-wide ticket discovery.
- [x] **My Picks**: Dedicated workflow for assigned ticket management.

### **Feature Implementation**
- [x] **Real-time Chat**: Functional messaging system with online/offline indicators.
- [x] **Notification System**: Added real-time alerts for likes, comments, and assignments.
- [x] **Search & Discovery**: Robust Explore page and global Admin search.
- [x] **Theme Synchrony**: Fully responsive and theme-aware UI (Glassmorphic Dark/Light).

### **Polish & UX**
- [x] Unified "Pill-style" design language across all filtering sections.
- [x] Implemented live state re-fetching to eliminate manual page refreshes.
- [x] Optimized date/time formatting for platform records.

---

## 📝 Next Steps (Proposed)
1. **Developer Performance Analytics**: Detailed metrics on resolution times and peer ratings.
2. **Global System Logs**: Audit trail for admin actions (role changes, ticket deletions).
3. **Advanced RBAC Permissions**: Granular permissions for "Lead Developers" or "Moderators".
4. **Code Sandbox Integration**: Direct snippet execution for troubleshooting. 
