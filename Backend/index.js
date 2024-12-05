const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(bodyParser.json());

/*Conexion a la base de datos  MongoDB*/

mongoose
    .connect('mongodb://localhost:27017/agenda_citas', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Conectado a la base de datos');
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(4000, () => {
    console.log('Server on port', 4000);
});

// Definicion de rutas
const appointmentRoutes = require('./routes/appointments');
app.use('/api/appointments', appointmentRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const professionalRoutes = require('./routes/professionalRoutes');
app.use('/api/professionals', professionalRoutes);
