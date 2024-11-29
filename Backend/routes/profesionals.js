const express = require('express');
const router = express.Router();
const profesional = require('../models/Profesional');

// Ruta para agregar multiples prefesionales
router.post('/bulk', async (req, res) => {
    try {
        const profesionales = req.body;
        const result = await profesional.insertMany(profesionales);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Ruta para obtener todos los profesionales
router.get('/', async (req, res) => {
    try {
        const profesionales = await profesional.find();
        res.send(profesionales);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;