const Appointment = require('../models/Appointment');

// Get all appointments
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get appointments by user ID
exports.getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.params.userId });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get appointments by professional ID
exports.getProfessionalAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ professionalId: req.params.professionalId });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
    const appointment = new Appointment({
        userId: req.body.userId,
        professionalId: req.body.professionalId,
        speciality: req.body.speciality,
        reason: req.body.reason,
        date: req.body.date,
        status: req.body.status || 'Pendiente'
    });

    try {
        const newAppointment = await appointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        appointment.status = req.body.status;
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        await appointment.remove();
        res.json({ message: 'Cita eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
