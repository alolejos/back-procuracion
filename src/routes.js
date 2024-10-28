const express = require('express');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const expedienteRoutes = require('./routes/expedienteRoutes'); // Importar las rutas de expediente

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// File routes
router.use('/files', fileRoutes);

// Expediente routes
router.use('/expedientes', expedienteRoutes); // Agregar las rutas de expediente

module.exports = router;
