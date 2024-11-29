const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

//Crear una nueva cita
router.post('/', async (req, res) => {
    const appointment = new Appointment(req.body);
    try {
        await appointment.save();
        res.status(201).send(appointment);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Obtener todas las citas de un usuario
router.get('/user/:id', async (req, res) => {
    try {
        const appointments = await Appointment.find({ usedId: req.params.id });
        res.send(appointments);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Actualizar una cita existente de un usuario
router.put('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!appointment) {
            return res.status(404).send();
        }
        res.send(appointment);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Eliminar una cita existente de un usuario
router.delete('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).send();
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;	