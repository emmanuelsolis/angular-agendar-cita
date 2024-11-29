// backend/models/Profesional.js
const mongoose = require('mongoose');

const ProfesionalSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  telefono: String,
  especialidad: String,
  // Otros campos necesarios
});

module.exports = mongoose.model('Profesional', ProfesionalSchema);
