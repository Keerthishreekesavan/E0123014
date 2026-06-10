# Notification Backend

A RESTful notification service supporting email, SMS, and push channels, with retry logic and status tracking.

---

## 🚀 Quick Start

```bash
cd notification_app_be
npm install
cp .env.example .env
npm run dev
```

Server runs on `http://localhost:3002`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List all notifications |
| GET | `/api/notifications/:id` | Get notification by ID |
| POST | `/api/notifications` | Send a new notification |
| PUT | `/api/notifications/:id` | Update a notification |
| DELETE | `/api/notifications/:id` | Delete a notification |
| POST | `/api/notifications/:id/retry` | Retry a failed notification |

---

## 📝 POST /api/notifications — Request Body

```json
{
  "type": "email",
  "recipient": "user@example.com",
  "subject": "Your appointment is confirmed",
  "message": "Your vehicle maintenance is scheduled for July 1, 2026."
}
```

### SMS Example
```json
{
  "type": "sms",
  "recipient": "+919876543210",
  "message": "Your vehicle maintenance is scheduled for July 1, 2026."
}
```

### Push Example
```json
{
  "type": "push",
  "recipient": "device-token-xyz",
  "message": "Maintenance reminder: Oil change due tomorrow."
}
```

---

## ✅ Allowed Values

### Type
`email`, `sms`, `push`

### Status
`PENDING`, `SENT`, `FAILED`

---

## 🔁 Retry Logic

- Only `FAILED` notifications can be retried
- Maximum **3 retries** per notification
- Each retry increments `retryCount`

---

## 📊 Notification Response Schema

```json
{
  "id": "uuid",
  "type": "email",
  "recipient": "user@example.com",
  "subject": "...",
  "message": "...",
  "status": "SENT",
  "retryCount": 0,
  "createdAt": "2026-06-10T05:30:00.000Z",
  "updatedAt": "2026-06-10T05:30:01.000Z"
}
```
