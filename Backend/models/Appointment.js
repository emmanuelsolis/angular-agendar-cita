const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    usedId: String,
    profesionalId: String,
    speciality: String,
    reason: String,
    date: Date,
    status:  {
        type: String,
        enum: ["Pendiente", "Aceptada", "Rechazada"],
        default: "Pendiente"
    }
});

module.exports = mongoose.model("Appointment", appointmentSchema);