const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authMiddleware = require('../middleware/auth');
// Proteger las rutas con el middleware de autenticación
router.use(authMiddleware);
// Crear nueva alerta
router.post('/', alertController.createAlert);

// Obtener alertas por tipo de usuario
router.get('/user-type/:userTypeId', alertController.getAlertsByUserType);

// Obtener alerta por archivo
router.get('/file/:fileId', alertController.getAlertByFile);

// Marcar alerta como leída
router.put('/:alertId/read', alertController.markAlertAsRead);

// Obtener alertas por expediente
router.get('/expediente/:expedienteId', alertController.getAlertsByExpediente);

// Obtener alertas por sector
router.get('/sector/:sectorId', alertController.getAlertsBySector);
router.get('/count/sector/:sectorId', alertController.getAlertsCountBySector);

router.put('/:alertId', alertController.markAlertAsRead);

module.exports = router; 