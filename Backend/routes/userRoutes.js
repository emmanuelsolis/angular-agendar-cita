const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtConfig = require('../config/jwt.config');

// Rutas públicas de autenticación
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas protegidas que requieren autenticación
router.get('/profile', jwtConfig.verifyToken, userController.getProfile);
router.put('/profile', jwtConfig.verifyToken, userController.updateProfile);
router.post('/logout', jwtConfig.verifyToken, userController.logout);

// Rutas administrativas (requieren rol de admin)
router.get('/users', jwtConfig.verifyToken, jwtConfig.isAdmin, userController.getUsers);
router.get('/users/:id', jwtConfig.verifyToken, jwtConfig.isAdmin, userController.getUserById);
router.delete('/users/:id', jwtConfig.verifyToken, jwtConfig.isAdmin, userController.deleteUser);

module.exports = router;
