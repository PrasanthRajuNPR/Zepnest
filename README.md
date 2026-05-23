# Zepnest — Service Request Application

> Home Care, At a Tap. — Full-stack mini-project for the Zepnest Engineering internship.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | Node.js + Express.js                            |
| Database  | MySQL (Railway cloud)                           |
| Auth      | JWT stored in cookies (2-day expiry)            |
| Images    | Cloudinary                                      |
| Frontend  | React (single app — User + Admin combined)      |

---

## Project Structure

```
zepnest/
├── backend/
│   ├── config/
│   │   ├── db.js               # MySQL connection pool (Railway)
│   │   └── cloudinary.js       # Cloudinary + Multer setup
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── requestController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verify
│   │   └── roleMiddleware.js   # adminOnly / userOnly
│   ├── models/
│   │   ├── userModel.js
│   │   ├── adminModel.js
│   │   └── requestModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── requestRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── generateToken.js    # JWT + cookie setter
│   ├── schema.sql
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── public/
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.js
        ├── components/
        │   ├── Navbar
        │   ├── RequestCard
        │   └── CreateRequestModal
        └── pages/
            ├── LoginPage          # User + Admin login (tabbed)
            ├── RegisterPage
            ├── DashboardPage      # User dashboard
            ├── AdminUsersPage     # /admin/users
            └── AdminUserRequestsPage  # /admin/users/:id
```

---

## Prerequisites

- Node.js v18+
- npm
- A [Railway](https://railway.app) account with a MySQL service
- A [Cloudinary](https://cloudinary.com) account (free tier is fine)

---

## Setup Instructions

### Step 1 — Database (Railway MySQL)

1. Go to [railway.app](https://railway.app) → New Project → Add MySQL
2. Open the MySQL service → **Connect** tab → copy the credentials
3. Open the **Query** tab and run the contents of `backend/schema.sql` to create all tables

### Step 2 — Backend

```bash
cd backend
npm install
```

Open `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development

JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=2d

DB_HOST=your_railway_host
DB_PORT=your_railway_port
DB_USER=root
DB_PASSWORD=your_railway_password
DB_NAME=railway

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

USER_UI_URL=http://localhost:3000
ADMIN_UI_URL=http://localhost:3001
```

---

### ⚠️ Important — Cookie Configuration for Localhost

JWT tokens are stored in HTTP cookies. The current configuration in `backend/utils/generateToken.js`:

```js
res.cookie('token', token, {
  secure: process.env.NODE_ENV === 'production',  // false on localhost ✅
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 2 * 24 * 60 * 60 * 1000,
});
```

> Note: `httpOnly` is not used — this ensures logout correctly clears the cookie.

**As long as `NODE_ENV=development` in your `.env`, cookies will work on localhost without any changes.**

However, if cookies are still not being sent/received on localhost, check:
- Your `.env` has `NODE_ENV=development` (not `production`)
- The frontend `axios` instance has `withCredentials: true` (already set in `frontend/src/api/axios.js`)
- Your browser is not blocking cookies for `localhost`

> **For production deployment:** Set `NODE_ENV=production` in your environment. The `secure: true` and `sameSite: 'none'` flags require HTTPS — make sure your server is behind SSL.

---

### 🍪 Third-Party Cookies — Required for Production

When the frontend and backend are deployed on **different domains** (e.g. Vercel + Railway), the browser treats the backend cookie as a **third-party cookie**. You must enable third-party cookies in your browser for login to work.

**How to enable on Desktop (Chrome):**
1. Open Chrome → click the **eye / info icon** in the address bar
2. Click **"Third-party cookies"** → select **"Allow cookies for this site"**
3. Or go to: [chrome://settings/cookies](chrome://settings/cookies) → turn off "Block third-party cookies"

**How to enable on Mobile (Chrome Android / iOS):**
1. Open Chrome → tap the **three dots menu** → Settings
2. Go to **Privacy and Security** → **Cookies**
3. Select **"Allow all cookies"**

**How to enable on Safari (iOS/macOS):**
1. Settings → Safari → uncheck **"Prevent Cross-Site Tracking"**

> ⚠️ If a user opens the app and login doesn't work / they get logged out immediately, the cause is almost always **third-party cookies being blocked**. Ask them to enable third-party cookies using the steps above and refresh the page.

---

Start the backend:

```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```

Server starts on `http://localhost:5000`

### Step 3 — Seed the First Admin

Run this once after the backend is running (only works when `NODE_ENV=development`):

```bash
curl -X POST http://localhost:5000/api/auth/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@zepnest.com","password":"Admin@123"}'
```

Or use Postman / any HTTP client with:
- **POST** `http://localhost:5000/api/auth/admin/seed`
- Body (JSON): `{ "name": "Admin", "email": "admin@zepnest.com", "password": "Admin@123" }`

### Step 4 — Frontend

```bash
cd frontend
npm install
npm start        # opens http://localhost:3000
```

---

## Running the App

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm start
```

Then open `http://localhost:3000` in your browser.

- **User login/register** → use the User tab on the login page
- **Admin login** → click the **"🛡 Admin"** button (top-right on the login page), or use the Admin tab

---

## How Roles Work

| Role  | Access                                              |
|-------|-----------------------------------------------------|
| User  | Register, login, create/view/delete own requests    |
| Admin | Login via Admin tab, view all users, view & update all requests |

---

## Environment Variables Reference

| Variable               | Description                              |
|------------------------|------------------------------------------|
| `PORT`                 | Backend server port (default: 5000)      |
| `NODE_ENV`             | `development` or `production`            |
| `JWT_SECRET`           | Secret key for signing JWT tokens        |
| `JWT_EXPIRES_IN`       | Token expiry (default: `2d`)             |
| `DB_HOST`              | Railway MySQL host                       |
| `DB_PORT`              | Railway MySQL port                       |
| `DB_USER`              | MySQL username                           |
| `DB_PASSWORD`          | MySQL password                           |
| `DB_NAME`              | MySQL database name                      |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud name                    |
| `CLOUDINARY_API_KEY`   | Cloudinary API key                       |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret                    |
| `USER_UI_URL`          | Frontend URL for CORS (default: port 3000)|
| `ADMIN_UI_URL`         | Admin UI URL for CORS (default: port 3001)|
