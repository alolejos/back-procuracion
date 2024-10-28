const express = require('express');
const expedienteController = require('../controllers/expedienteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Proteger las rutas con el middleware de autenticación
router.use(authMiddleware);

router.post('/', expedienteController.createExpediente); // Ruta para crear un expediente
// Agrega más rutas según sea necesario

module.exports = router;
