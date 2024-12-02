const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true
    },
    especialidad: {
        type: String,
        required: [true, 'La especialidad es requerida']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es requerido']
    },
    horariosDisponibles: [{
        fecha: {
            type: Date,
            required: true
        },
        horasDisponibles: [String]
    }],
    citas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Professional', professionalSchema);
