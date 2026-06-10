// src/models/maintenanceModel.js
// In-memory data model for maintenance schedules

const { v4: uuidv4 } = require('uuid');

const maintenanceRecords = [];

function createMaintenance({ vehicleId, type, scheduledDate, notes, status }) {
  const record = {
    id: uuidv4(),
    vehicleId,
    type,
    scheduledDate,
    notes: notes || '',
    status: status || 'SCHEDULED',   // SCHEDULED | COMPLETED | CANCELLED
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  maintenanceRecords.push(record);
  return record;
}

function findAllMaintenance() {
  return maintenanceRecords;
}

function findMaintenanceById(id) {
  return maintenanceRecords.find((r) => r.id === id) || null;
}

function findMaintenanceByVehicleId(vehicleId) {
  return maintenanceRecords.filter((r) => r.vehicleId === vehicleId);
}

function updateMaintenance(id, updates) {
  const idx = maintenanceRecords.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  maintenanceRecords[idx] = {
    ...maintenanceRecords[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return maintenanceRecords[idx];
}

function deleteMaintenance(id) {
  const idx = maintenanceRecords.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  maintenanceRecords.splice(idx, 1);
  return true;
}

module.exports = {
  createMaintenance,
  findAllMaintenance,
  findMaintenanceById,
  findMaintenanceByVehicleId,
  updateMaintenance,
  deleteMaintenance,
};
