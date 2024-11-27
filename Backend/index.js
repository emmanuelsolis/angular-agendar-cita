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

    // Definicion de rutas
    app.listen(4000, () => {
        console.log('Server on port', 4000);
    });