# Vehicle Maintenance Scheduler

A RESTful API for scheduling and managing vehicle maintenance tasks, built with MVC + Service + Repository pattern.

---

## 🚀 Quick Start

```bash
cd vehicle_maintenance_scheduler
npm install
cp .env.example .env
npm run dev
```

Server runs on `http://localhost:3001`

---

## 🌐 API Endpoints

### Vehicles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | List all vehicles |
| GET | `/api/vehicles/:id` | Get vehicle by ID |
| POST | `/api/vehicles` | Create a new vehicle |
| PUT | `/api/vehicles/:id` | Update a vehicle |
| DELETE | `/api/vehicles/:id` | Delete a vehicle |
| GET | `/api/vehicles/:vehicleId/maintenance` | Get maintenance for a vehicle |

### Maintenance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/maintenance` | List all maintenance records |
| GET | `/api/maintenance/:id` | Get record by ID |
| POST | `/api/maintenance` | Schedule new maintenance |
| PUT | `/api/maintenance/:id` | Update maintenance record |
| DELETE | `/api/maintenance/:id` | Delete maintenance record |

---

## 📝 Request Body Examples

### POST /api/vehicles
```json
{
  "ownerId": "owner-001",
  "make": "Toyota",
  "model": "Camry",
  "year": 2022,
  "licensePlate": "TN-01-AB-1234"
}
```

### POST /api/maintenance
```json
{
  "vehicleId": "<vehicle-uuid>",
  "type": "oil_change",
  "scheduledDate": "2026-07-01T10:00:00Z",
  "notes": "Use synthetic oil",
  "status": "SCHEDULED"
}
```

### PUT /api/maintenance/:id
```json
{
  "status": "COMPLETED"
}
```

---

## ✅ Allowed Values

### Maintenance Types
`oil_change`, `tire_rotation`, `brake_service`, `engine_check`, `battery_check`, `general_service`

### Maintenance Status
`SCHEDULED`, `COMPLETED`, `CANCELLED`

---

## ⏰ Scheduler
The built-in scheduler runs every 60 seconds and logs:
- ⚠️ **Overdue** maintenance records (past due date, still SCHEDULED)
- 📅 **Upcoming** maintenance within the next 7 days
