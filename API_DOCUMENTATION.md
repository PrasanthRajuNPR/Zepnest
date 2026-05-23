# Zepnest API Documentation

Base URL: `http://localhost:5000`

All request/response bodies are JSON unless noted.  
Authentication uses **HTTP-only cookies** — the `token` cookie is set automatically on login and sent automatically by the browser on subsequent requests.

---

## Authentication

### POST /api/auth/register
Register a new user.

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Validations**
- All fields required
- Password minimum 6 characters
- Email must be unique

**Response `201`**
```json
{
  "message": "Registration successful",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```
> Sets `token` cookie automatically.

**Errors**
| Status | Message |
|--------|---------|
| 400 | All fields are required |
| 400 | Password must be at least 6 characters |
| 409 | Email already registered |

---

### POST /api/auth/login
Login as a user.

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`**
```json
{
  "message": "Login successful",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```
> Sets `token` cookie automatically.

**Errors**
| Status | Message |
|--------|---------|
| 400 | Email and password are required |
| 401 | Invalid email or password |

---

### POST /api/auth/admin/login
Login as an admin.

**Request Body**
```json
{
  "email": "admin@zepnest.com",
  "password": "Admin@123"
}
```

**Response `200`**
```json
{
  "message": "Admin login successful",
  "admin": { "id": 1, "name": "Admin", "email": "admin@zepnest.com" }
}
```
> Sets `token` cookie with `role: 'admin'` payload.

**Errors**
| Status | Message |
|--------|---------|
| 401 | Invalid admin credentials |

---

### POST /api/auth/logout
Clear the auth cookie and log out.

**Auth required:** No

**Response `200`**
```json
{ "message": "Logged out successfully" }
```

---

### GET /api/auth/me
Get the currently logged-in user/admin.

**Auth required:** Yes (any role)

**Response `200` — User**
```json
{
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "user" }
}
```

**Response `200` — Admin**
```json
{
  "user": { "id": 1, "name": "Admin", "email": "admin@zepnest.com", "role": "admin" }
}
```

---

### POST /api/auth/admin/seed
Create the first admin account. **Development only** (`NODE_ENV=development`).

**Request Body**
```json
{
  "name": "Admin",
  "email": "admin@zepnest.com",
  "password": "Admin@123"
}
```

**Response `201`**
```json
{ "message": "Admin created successfully" }
```

**Errors**
| Status | Message |
|--------|---------|
| 403 | Not available in production |
| 409 | Admin already exists |

---

## Service Requests (User)

All routes below require a valid user JWT cookie (`role: 'user'`).

---

### GET /api/requests/my
Get all requests belonging to the logged-in user.

**Auth required:** User

**Response `200`**
```json
{
  "requests": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Fix leaking pipe",
      "description": "Kitchen sink pipe is leaking under the cabinet",
      "category": "Plumbing",
      "address": "12 MG Road, Bangalore",
      "preferred_time": "2025-08-10T10:00:00.000Z",
      "status": "Pending",
      "image_url": "https://res.cloudinary.com/...",
      "created_at": "2025-08-01T07:30:00.000Z"
    }
  ]
}
```

---

### POST /api/requests
Create a new service request. Supports optional image upload (`multipart/form-data`).

**Auth required:** User

**Content-Type:** `multipart/form-data`

**Form Fields**
| Field | Type | Required |
|-------|------|----------|
| title | string | Yes |
| description | string | Yes |
| category | string | Yes |
| address | string | Yes |
| preferred_time | datetime-local string | Yes |
| image | file (jpg/png/webp, max 5MB) | No |

**Response `201`**
```json
{
  "message": "Request created successfully",
  "request": {
    "id": 2,
    "user_id": 1,
    "title": "Fix leaking pipe",
    "description": "...",
    "category": "Plumbing",
    "address": "12 MG Road",
    "preferred_time": "2025-08-10T10:00:00.000Z",
    "status": "Pending",
    "image_url": "https://res.cloudinary.com/...",
    "created_at": "2025-08-01T08:00:00.000Z"
  }
}
```

**Errors**
| Status | Message |
|--------|---------|
| 400 | All fields are required |

---

### DELETE /api/requests/:id
Delete a service request. Only the owner can delete their own request.

**Auth required:** User

**URL Params:** `id` — request ID

**Response `200`**
```json
{ "message": "Request deleted successfully" }
```

**Errors**
| Status | Message |
|--------|---------|
| 404 | Request not found |
| 403 | Not authorized to delete this request |

---

## Admin Routes

All routes below require a valid admin JWT cookie (`role: 'admin'`).

---

### GET /api/admin/users
Get all registered users.

**Auth required:** Admin

**Response `200`**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2025-08-01T07:00:00.000Z"
    }
  ]
}
```

---

### GET /api/admin/users/:userId/requests
Get all requests for a specific user. Optionally filter by status.

**Auth required:** Admin

**URL Params:** `userId` — user ID

**Query Params**
| Param | Values | Description |
|-------|--------|-------------|
| status | `Pending` \| `In Progress` \| `Completed` \| `Cancelled` | Filter by status (optional) |

**Example:** `GET /api/admin/users/1/requests?status=Pending`

**Response `200`**
```json
{
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
  "requests": [ { ...request objects } ]
}
```

**Errors**
| Status | Message |
|--------|---------|
| 404 | User not found |

---

### GET /api/admin/requests
Get all requests from all users. Optionally filter by status.

**Auth required:** Admin

**Query Params**
| Param | Values | Description |
|-------|--------|-------------|
| status | `Pending` \| `In Progress` \| `Completed` \| `Cancelled` | Filter by status (optional) |

**Response `200`**
```json
{
  "requests": [
    {
      "id": 1,
      "user_id": 1,
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "title": "Fix leaking pipe",
      "status": "Pending",
      ...
    }
  ]
}
```

---

### PATCH /api/admin/requests/:id/status
Update the status of a service request.

**Auth required:** Admin

**URL Params:** `id` — request ID

**Request Body**
```json
{ "status": "In Progress" }
```

**Valid status values:** `Pending`, `In Progress`, `Completed`, `Cancelled`

**Response `200`**
```json
{
  "message": "Status updated successfully",
  "status": "In Progress"
}
```

**Errors**
| Status | Message |
|--------|---------|
| 400 | Invalid status value |
| 404 | Request not found |

---

## Error Response Format

All errors follow this format:
```json
{ "message": "Descriptive error message here" }
```

---

## Authentication Notes

### ⚠️ Cookie Setup for Localhost

Tokens are stored in cookies. The current config in `backend/utils/generateToken.js`:

```js
res.cookie('token', token, {
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 2 * 24 * 60 * 60 * 1000,
});
```

> Note: `httpOnly` is not used — ensures logout properly clears the cookie.

- **Localhost:** Works automatically. `secure: false`, `sameSite: lax`
- **Production:** Set `NODE_ENV=production`. Requires HTTPS for `secure: true` + `sameSite: none`
- **Postman testing:** Enable **"Send cookies"** and **"Automatically follow redirects"** in Postman settings.

### 🍪 Third-Party Cookies — Required for Production

When frontend and backend are on **different domains**, the browser blocks the cookie by default. Users must enable third-party cookies or login will fail silently.

**Chrome (Desktop):**
- Click the eye/info icon in address bar → "Third-party cookies" → Allow
- Or visit: [chrome://settings/cookies](chrome://settings/cookies) → disable "Block third-party cookies"

**Chrome (Mobile — Android/iOS):**
- Three dots → Settings → Privacy and Security → Cookies → **Allow all cookies**

**Safari (iOS/macOS):**
- Settings → Safari → uncheck **"Prevent Cross-Site Tracking"**

> ⚠️ If login fails immediately on production, third-party cookies being blocked is the most likely cause. Direct users to enable them using the steps above.

### Token Expiry
- Tokens expire after **2 days**
- Expired tokens return `401: Token expired, please login again`
- The frontend axios interceptor catches 401s and redirects to `/login` automatically

---

## Status Flow

```
Pending → In Progress → Completed
                     ↘ Cancelled
```

Only admins can change request status. Users can only delete their own requests.
