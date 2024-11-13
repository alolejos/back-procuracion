const express = require('express');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const expedienteRoutes = require('./routes/expedienteRoutes'); // Importar las rutas de expediente
const reporteRoutes = require('./routes/reporteRoutes');
const userTypeRoutes = require('./routes/userTypeRoutes');
const userRoutes = require('./routes/userRoutes');
const alertRoutes = require('./routes/alertRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/files', fileRoutes);
router.use('/expedientes', expedienteRoutes); // Agregar las rutas de expediente
router.use('/reports', reporteRoutes);
router.use('/user-types', userTypeRoutes);
router.use('/users', userRoutes);
router.use('/alerts', alertRoutes);

module.exports = router;
