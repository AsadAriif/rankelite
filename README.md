# EliteRank — The Global Power & Excellence Rankings Platform

EliteRank is a luxury-themed, full-stack ranking and catalog platform designed for high-net-worth intelligence, hypercar specifications, technology benchmarks, and premier academic institution rankings.

Built with a modern stack featuring **Node.js, Express.js, PostgreSQL, React.js, Tailwind CSS, Bootstrap 5, and JWT Authentication**.

---

## 🌟 Key Features

### Public Platform
- **Luxury Aesthetic**: Deep Dark Background (`#080808`), Royal Gold accents (`#D4AF37`, `#FFD700`), Glassmorphism cards (`backdrop-filter`), smooth hover glow effects, and counter animations.
- **Dynamic Categories & Dynamic Custom Fields**: Unlimited categories (Billionaires, Supercars, Smartphones, Universities, Tech Companies, Airlines, Luxury Hotels, Football Clubs).
- **Item Rank Profiles**: High-resolution image showcases, rank badges (#1 Gold, #2 Silver, #3 Bronze), dynamic specifications table, views tracking, and related rankings.
- **Global Power Search**: Live autocomplete modal, multi-attribute filter by category, country, sort order (Rank #1-100, Views, Title A-Z).
- **VIP Favorites Portfolio**: Registered members can save items to their personal portfolio.

### Executive Admin Console
- **Interactive Analytics Dashboard**: Total Users, Total Categories, Total Ranked Items, Total Views, Top Viewed Ranks.
- **Category & Dynamic Field Schema Builder**: Create categories and add dynamic custom fields (`currency`, `number`, `text`, `url`).
- **Item Manager**: Add/Edit/Delete rank items with form inputs dynamically generated based on the selected category's schema.
- **User Role Manager**: Promote/demote users to Admin privileges or remove accounts.
- **Website Settings**: Customize site branding, tagline, hero text, and contact email.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Bootstrap 5, React Router DOM, Axios, Lucide React icons.
- **Backend**: Node.js, Express.js, JWT Authentication, bcrypt, Helmet, CORS, Express Rate Limit, Multer file upload.
- **Database**: PostgreSQL (`pg` pool) with automatic schema migration, rich seed script, and high-performance in-memory fallback mode.

---

## 🚀 Quick Start Instructions

### 1. Backend API Server
```bash
cd backend
npm install
npm start
```
*The Backend server starts on **http://localhost:5000/api***

### 2. Frontend User Application
```bash
cd frontend
npm install
npm run dev
```
*The Frontend user application starts on **http://localhost:3000***

### 3. Standalone Admin Console
```bash
cd admin
npm install
npm run dev
```
*The Standalone Admin console starts on **http://localhost:3001***

---

## 🔐 Default Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@eliterank.com` | `Admin123!` |
| **VIP Member** | `user@eliterank.com` | `User123!` |

---

## 🗄️ PostgreSQL Setup (Optional)

If running a local PostgreSQL server, initialize the schema & seed data:
```bash
cd backend
npm run seed
```
Configure your credentials in `backend/.env`:
```env
PGHOST=localhost
PGPORT=5432
PGDATABASE=eliterank_db
PGUSER=postgres
PGPASSWORD=postgres
```
