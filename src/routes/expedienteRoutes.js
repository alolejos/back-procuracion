const express = require('express');
const router = express.Router();
const expedienteController = require('../controllers/expedienteController');
const authMiddleware = require('../middleware/auth');
// Proteger las rutas con el middleware de autenticación
router.use(authMiddleware);

router.post('/', expedienteController.createExpediente); // Ruta para crear un expediente
router.get('/', expedienteController.getAllExpedientes);
router.get('/:id', expedienteController.getExpedienteById);
router.get('/:id/archivos', expedienteController.getExpedienteFiles);
// Agrega más rutas según sea necesario

module.exports = router;



