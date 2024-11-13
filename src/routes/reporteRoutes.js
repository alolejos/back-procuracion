const express = require('express');
const reporteController = require('../controllers/reporteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All file routes are protected by the authMiddleware
router.use(authMiddleware);

router.get('/', reporteController.getReportes);
router.get('/:id', reporteController.getReporteById);
router.post('/create', reporteController.createReporte);

module.exports = router;