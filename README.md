# e0123011 — Backend Track

**Roll No:** e0123011  
**Name:** Abirami  
**Email:** abiramikarunakaran7@gmail.com

---

## 📁 Project Structure

```
e0123011/
├── logging_middleware/          # Reusable logging middleware
├── vehicle_maintenance_scheduler/  # Vehicle maintenance scheduling API
├── notification_app_be/         # Notification backend service
├── notification_system_design.md   # System design document
├── README.md
└── .gitignore
```

---

## 🚀 Projects

### 1. Logging Middleware
A reusable middleware module that validates input, attaches Bearer Token, and posts structured logs to the evaluation service.

### 2. Vehicle Maintenance Scheduler
A RESTful API to schedule and manage vehicle maintenance tasks using MVC + Service + Repository pattern.

### 3. Notification Backend
A backend service to send and manage notifications (email, SMS, push) using a modular architecture.

---

## 🛠 Tech Stack
- Node.js
- Express.js
- JavaScript
- Axios
- dotenv
- cors
- nodemon

---

## 📐 Architecture
```
Client → Routes → Controllers → Services → Repositories → Database/Business Logic → Response → Logging Middleware
```
