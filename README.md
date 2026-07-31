# ⚽ TurfHub — Full-Stack Turf & Sports Venue Management System

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)

**TurfHub** is an end-to-end, production-grade web application built for sports enthusiasts, venue owners, and administrators. It enables seamless discovery, real-time slot checking, online Razorpay booking, and automated email/WhatsApp confirmations.

---

## 🌐 Live Deployments

- 🚀 **Frontend App (Vercel)**: [https://turf-management-system-six.vercel.app/](https://turf-management-system-six.vercel.app/)
- ⚙️ **Backend API (Render)**: [https://turf-management-system-ceax.onrender.com](https://turf-management-system-ceax.onrender.com)

---

## 🌟 Key Features

### 👤 Customer Features
- **Venue Discovery & Filtering**: Search turfs by name, city, or sports type (Cricket, Football, Tennis, Basketball, Badminton).
- **Interactive Turf Detail Pages**: High-resolution image gallery, amenity checklists, opening hours, pricing, and exact geolocation coordinates.
- **7-Day Dynamic Slot Calendar**: Check real-time slot availability for any date across morning, afternoon, and evening hours.
- **Razorpay Online Payments**: Instant checkout with automated signature verification on the backend.
- **Automated Notifications**: Instant booking confirmation via **Email** (Nodemailer) and **WhatsApp Cloud API** (Meta).
- **Personal Dashboard**: View reservation history, payment statuses, and cancel active bookings.

### 🏟️ Owner Dashboard
- **Venue Management**: Create, edit, and delete turfs with multi-file Cloudinary image uploads.
- **Real-Time Booking Schedule**: Monitor player reservations, revenues, and slot schedules.
- **Operational Controls**: Easily toggle venue status (`Active` / `Inactive`).

### 🛡️ Admin Capabilities
- **Platform Management**: Create owner accounts (`POST /auth/owner/register`), oversee user roles, and manage site-wide venue listings.
- **Security**: Strict Role-Based Access Control (RBAC) powered by JWT authentication and Redis token blacklisting.

### ☀️ Theme System (Light & Dark Mode)
- **Zero FOUC**: Synchronous script injection prevents flash of unstyled content on initial page load.
- **Global Theme Context**: OS preference detection, persistent `localStorage` synchronization, and smooth 200ms color transitions across all components.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Framer Motion (micro-animations & smooth transitions)
- **HTTP Client**: Axios (with credentials & auth interceptors)
- **Icons**: React Icons (`fa`)

### **Backend**
- **Runtime**: Node.js + Express + TypeScript
- **Database**: MongoDB (Mongoose ORM)
- **Caching & Blacklisting**: Redis
- **File Storage**: Cloudinary (Multer memory storage)
- **Payments**: Razorpay Node SDK
- **Notifications**: Nodemailer (SMTP) & Meta WhatsApp Cloud API

---

## 📁 Project Structure

```
TurfManagement/
├── backend/
│   ├── src/
│   │   ├── config/          # Redis & Cloudinary configs
│   │   ├── controllers/     # Auth, Turf, and Booking controllers
│   │   ├── middlewares/     # Auth, Admin, Owner, Multer, Error handlers
│   │   ├── models/          # User, Turf, and Booking Mongoose schemas
│   │   ├── routes/          # Auth, Turf, Booking, Webhook Express routers
│   │   ├── utils/           # Nodemailer, WhatsApp, Cloudinary, Razorpay helpers
│   │   └── app.ts           # Express setup, CORS, Cookie Parser
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/          # Static images & branding assets
    │   ├── context/         # AuthContext & ThemeContext providers
    │   ├── features/        # Home, Auth, Booking, Turf, Profile, Owner pages
    │   ├── layouts/         # Navbar & Footer components
    │   ├── lib/             # Axios instance & interceptors
    │   ├── services/        # API service layers (auth, turf, booking, owner)
    │   ├── index.css        # Tailwind v4 import & dark variant setup
    │   └── App.tsx          # Router configuration
    └── package.json
```

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `backend/` directory with the following variables:

```env
# Server
PORT=8000
NODE_ENV=development

# Database & Cache
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/turf_management
REDIS_PASS=your_redis_password

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email (Nodemailer / Gmail App Password)
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_16_char_app_password

# WhatsApp Notifications (Meta Cloud API)
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_meta_permanent_access_token
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local instance or MongoDB Atlas URI
- **Redis**: Local or cloud instance (e.g., Redis Labs)

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The Express backend server will start at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will launch at `http://localhost:5173`.

---

## 📡 API Endpoint Overview

### 🔑 Authentication (`/auth`)
- `POST /auth/register` — Register a new customer
- `POST /auth/login` — Log in user & obtain HTTP-only cookie / JWT token
- `POST /auth/logout` — Logout & blacklist current session in Redis
- `GET /auth/profile` — Fetch current user profile
- `POST /auth/owner/register` — Admin endpoint to create owner accounts

### 🏟️ Turfs (`/turf`)
- `GET /turf` — List all active turfs (with search & category filters)
- `GET /turf/:turfId` — Get detailed turf specs & photo gallery
- `GET /turf/my/turfs` — Fetch turfs belonging to logged-in owner
- `POST /turf` — Create a new turf (Owner/Admin, multipart images)
- `PATCH /turf/:id` — Update turf specifications
- `DELETE /turf/:id` — Delete a turf & purge Cloudinary images

### 📅 Bookings & Payments (`/booking`)
- `GET /booking/turf/:turfId/slots?date=YYYY-MM-DD` — Fetch real-time available time slots
- `POST /booking` — Create booking & initialize Razorpay order
- `POST /booking/verify` — Verify Razorpay signature & trigger confirmation notifications
- `GET /booking/my` — Fetch customer's booking history
- `GET /booking/turf/:turfId` — Fetch reservations for owner's turf
- `PATCH /booking/:id/cancel` — Cancel an active reservation

---

## 🔒 Security Highlights
- **CORS Protection**: Restricted to authorized origins with credential support.
- **Password Hashing**: Bcrypt with 10 salt rounds.
- **JWT Blacklisting**: Invalidated tokens stored in Redis upon logout.
- **Webhook Signature Verification**: HMAC SHA256 validation for Razorpay webhooks.

---

