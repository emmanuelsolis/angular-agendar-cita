const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const professionalRoutes = require('./routes/profesionals'); 
const jwtConfig = require('./config/jwt.config');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // Angular app URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agenda-citas';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Algo salió mal!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/appointments', jwtConfig.verifyToken, appointmentRoutes);
app.use('/api/professionals', professionalRoutes); 

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Backend API está funcionando');
});

const PORT = process.env.PORT || 4000; 
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    switch (error.code) {
        case 'EACCES':
            console.error(`Puerto ${PORT} requiere privilegios elevados`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Puerto ${PORT} ya está en uso`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
