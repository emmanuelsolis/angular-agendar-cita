const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Rutas públicas
router.get('/', professionalController.getProfessionals);
router.get('/specialty/:especialidad', professionalController.getProfessionalsBySpecialty);
router.get('/:id', professionalController.getProfessionalById);

// Rutas protegidas (requieren autenticación y rol de admin)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', professionalController.createProfessional);
router.put('/:id', professionalController.updateProfessional);
router.delete('/:id', professionalController.deleteProfessional);
router.put('/:id/schedule', professionalController.updateAvailableSchedule);

module.exports = router;
