// src/models/vehicleModel.js
// In-memory data model for vehicles

const { v4: uuidv4 } = require('uuid');

// In-memory store (replace with DB in production)
const vehicles = [];

function createVehicle({ ownerId, make, model, year, licensePlate }) {
  const vehicle = {
    id: uuidv4(),
    ownerId,
    make,
    model,
    year,
    licensePlate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  vehicles.push(vehicle);
  return vehicle;
}

function findAllVehicles() {
  return vehicles;
}

function findVehicleById(id) {
  return vehicles.find((v) => v.id === id) || null;
}

function updateVehicle(id, updates) {
  const idx = vehicles.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  vehicles[idx] = { ...vehicles[idx], ...updates, updatedAt: new Date().toISOString() };
  return vehicles[idx];
}

function deleteVehicle(id) {
  const idx = vehicles.findIndex((v) => v.id === id);
  if (idx === -1) return false;
  vehicles.splice(idx, 1);
  return true;
}

module.exports = { createVehicle, findAllVehicles, findVehicleById, updateVehicle, deleteVehicle };
