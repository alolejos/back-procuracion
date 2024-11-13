const { Alert, User, Expediente, File, Sector } = require('../models');
const { Op } = require('sequelize');

// Crear nueva alerta
exports.createAlert = async (req, res) => {
  try {
    const { resumen, sectorId, expedienteId, fileId, userId } = req.body;

    // Verificar que el archivo no tenga ya una alerta (debido a la relación one-to-one)
    const existingAlert = await Alert.findOne({ where: { fileId } });
    if (existingAlert) {
      return res.status(400).json({ error: 'Ya existe una alerta para este archivo' });
    }

    const alert = await Alert.create({
      resumen,
      sectorId,
      expedienteId,
      fileId,
      userId,
      estado: 'NOLEIDO'
    });

    res.status(201).json(alert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Error al crear la alerta' });
  }
};

// Obtener alertas por tipo de usuario
exports.getAlertsByUserType = async (req, res) => {
  try {
    const { userTypeId } = req.params;
    
    const alerts = await Alert.findAll({
      where: { userTypeId },
      include: [
        {
          model: Expediente,
          as: 'expediente',
          attributes: ['numeroExpediente', 'caratula']
        },
        {
          model: File,
          as: 'documento',
          attributes: ['realFileName', 'resumen']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error fetching alerts by user type:', error);
    res.status(500).json({ error: 'Error al obtener las alertas' });
  }
};

// Obtener alerta por documento
exports.getAlertByFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const alert = await Alert.findOne({
      where: { fileId },
      include: [
        {
          model: Expediente,
          as: 'expediente',
          attributes: ['numeroExpediente', 'caratula']
        },
        {
          model: File,
          as: 'documento',
          attributes: ['realFileName', 'resumen']
        }
      ]
    });

    if (!alert) {
      return res.status(404).json({ error: 'Alerta no encontrada' });
    }

    res.status(200).json(alert);
  } catch (error) {
    console.error('Error fetching alert by file:', error);
    res.status(500).json({ error: 'Error al obtener la alerta' });
  }
};

// Marcar alerta como leída
exports.markAlertAsRead = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findByPk(alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alerta no encontrada' });
    }

    await alert.update({ estado: 'LEIDO' });

    res.status(200).json({ message: 'Alerta marcada como leída', alert });
  } catch (error) {
    console.error('Error marking alert as read:', error);
    res.status(500).json({ error: 'Error al actualizar la alerta' });
  }
};

// Obtener todas las alertas de un expediente
exports.getAlertsByExpediente = async (req, res) => {
  try {
    const { expedienteId } = req.params;

    const alerts = await Alert.findAll({
      where: { expedienteId },
      include: [
        {
          model: File,
          as: 'documento',
          attributes: ['realFileName', 'resumen']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error fetching alerts by expediente:', error);
    res.status(500).json({ error: 'Error al obtener las alertas' });
  }
};

// Obtener alertas por sector
exports.getAlertsBySector = async (req, res) => {
  try {
    const { sectorId } = req.params;

    // Validar que el sector existe
    const sector = await Sector.findByPk(sectorId);
    if (!sector) {
      return res.status(404).json({
        error: 'Sector no encontrado'
      });
    }

    const alerts = await Alert.findAll({
      where: { sectorId },
      include: [
        {
          model: File,
          as: 'documento',
          attributes: ['realFileName', 'tipo', 'fileName']
        },
        {
          model: Expediente,
          as: 'expediente',
          attributes: ['numeroExpediente', 'caratula']
        },
        {
          model: User,
          as: 'usuario',
          attributes: ['username', 'name', 'surname']
        }
      ],
      order: [['createdAt', 'DESC']], // Ordenar por fecha de creación, más recientes primero
      attributes: {
        exclude: ['updatedAt'] // Excluir campos que no necesitamos
      }
    });

    res.status(200).json({
      count: alerts.length,
      alerts
    });

  } catch (error) {
    console.error('Error fetching alerts by sector:', error);
    res.status(500).json({
      error: 'Error al obtener las alertas del sector',
      details: error.message
    });
  }
}; 

exports.getAlertsCountBySector = async (req, res) => {
  try {
    const { sectorId } = req.params;

    const unreadCount = await Alert.count({
      where: {
        sectorId: sectorId,
        estado: 'NOLEIDO'
      }
    });

    res.status(200).json({
      success: true,
      sectorId,
      unreadCount
    });

  } catch (error) {
    console.error('Error getting alerts count:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el conteo de alertas',
      details: error.message
    });
  }
};