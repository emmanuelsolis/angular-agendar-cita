const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Get all appointments
router.get('/', appointmentController.getAppointments);

// Get appointments by user ID
router.get('/user/:userId', appointmentController.getUserAppointments);

// Get appointments by professional ID
router.get('/professional/:professionalId', appointmentController.getProfessionalAppointments);

// Create new appointment
router.post('/', appointmentController.createAppointment);

// Update appointment status
router.patch('/:id', appointmentController.updateAppointmentStatus);

// Delete appointment
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
