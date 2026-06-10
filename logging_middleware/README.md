# Logging Middleware

A reusable Node.js/Express middleware that validates log inputs and posts structured logs to the Afford Medical evaluation service.

---

## 📋 Features

- `Log(stack, level, package, message)` — core logging function
- Input validation against allowed stacks, levels, and packages
- Auto-attaches Bearer Token (with token caching & refresh)
- Automatic retry on 401 Unauthorized
- Express `requestLogger` middleware for automatic request/response logging
- Global error handler middleware

---

## 🚀 Quick Start

```bash
cd logging_middleware
npm install
cp .env.example .env   # fill in your credentials
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/health` | Service health |
| POST | `/api/register` | Register client |
| POST | `/api/auth` | Get Bearer token |
| POST | `/api/log` | Create a log entry |

---

## 📝 POST /api/log — Request Body

```json
{
  "stack": "backend",
  "level": "info",
  "package": "handler",
  "message": "Request received at /api/vehicles"
}
```

---

## ✅ Allowed Values

### Stack
`backend`, `frontend`

### Level
`debug`, `info`, `warn`, `error`, `fatal`

### Package
`cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`, `auth`, `config`, `middleware`, `utils`

---

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `CLIENT_ID` | Your client ID |
| `CLIENT_SECRET` | Your client secret |
| `ACCESS_CODE` | Access code from registration |
| `ACCESS_TOKEN` | Pre-fetched token (optional) |
| `BASE_URL` | Evaluation service base URL |
| `PORT` | Server port (default: 3000) |
