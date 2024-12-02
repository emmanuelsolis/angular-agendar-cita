const Professional = require('../models/Professional');

// Obtener todos los profesionales
exports.getProfessionals = async (req, res) => {
    try {
        const professionals = await Professional.find({ activo: true });
        res.status(200).json(professionals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener profesional por ID
exports.getProfessionalById = async (req, res) => {
    try {
        const professional = await Professional.findById(req.params.id);
        if (!professional) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }
        res.status(200).json(professional);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear nuevo profesional
exports.createProfessional = async (req, res) => {
    try {
        const { nombre, email, especialidad, telefono } = req.body;

        // Verificar si ya existe un profesional con ese email
        const existingProfessional = await Professional.findOne({ email });
        if (existingProfessional) {
            return res.status(400).json({ message: 'Ya existe un profesional con ese email' });
        }

        const professional = new Professional({
            nombre,
            email,
            especialidad,
            telefono,
            horariosDisponibles: [],
            citas: []
        });

        const savedProfessional = await professional.save();
        res.status(201).json(savedProfessional);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar profesional
exports.updateProfessional = async (req, res) => {
    try {
        const { nombre, email, especialidad, telefono } = req.body;
        const professional = await Professional.findById(req.params.id);

        if (!professional) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }

        // Verificar si el nuevo email ya está en uso por otro profesional
        if (email !== professional.email) {
            const existingProfessional = await Professional.findOne({ email });
            if (existingProfessional) {
                return res.status(400).json({ message: 'El email ya está en uso' });
            }
        }

        professional.nombre = nombre || professional.nombre;
        professional.email = email || professional.email;
        professional.especialidad = especialidad || professional.especialidad;
        professional.telefono = telefono || professional.telefono;

        const updatedProfessional = await professional.save();
        res.status(200).json(updatedProfessional);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar profesional (soft delete)
exports.deleteProfessional = async (req, res) => {
    try {
        const professional = await Professional.findById(req.params.id);
        if (!professional) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }

        professional.activo = false;
        await professional.save();

        res.status(200).json({ message: 'Profesional eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener profesionales por especialidad
exports.getProfessionalsBySpecialty = async (req, res) => {
    try {
        const { especialidad } = req.params;
        const professionals = await Professional.find({ 
            especialidad, 
            activo: true 
        });
        res.status(200).json(professionals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar horarios disponibles
exports.updateAvailableSchedule = async (req, res) => {
    try {
        const { horariosDisponibles } = req.body;
        const professional = await Professional.findById(req.params.id);

        if (!professional) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }

        professional.horariosDisponibles = horariosDisponibles;
        const updatedProfessional = await professional.save();

        res.status(200).json(updatedProfessional);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
