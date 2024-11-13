const { Expediente, File } = require('../models');

exports.createExpediente = async (req, res) => {
  try {
    const { caratula, numeroExpediente, jurisdiccion, nombreJuzgado, numeroJuzgado, numeroSecretaria, actora, demandada } = req.body;

    // Validar que se recibieron todos los datos necesarios
    if (!caratula || !numeroExpediente || !jurisdiccion || !nombreJuzgado || !numeroJuzgado || !numeroSecretaria || !actora || !demandada) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Crear un nuevo expediente
    const newExpediente = await Expediente.create({
      caratula,
      numeroExpediente,
      jurisdiccion,
      nombreJuzgado,
      numeroJuzgado,
      numeroSecretaria,
      actora,
      demandada,
      sectorId: 1,
      userId: req.user.id // Asumiendo que tienes el ID del usuario en req.user
    });

    res.status(201).json({ message: 'Expediente created successfully', expediente: newExpediente });
  } catch (error) {
    console.error('Error creating expediente:', error);
    res.status(500).json({ error: 'Error creating expediente' });
  }
};

// Obtener todos los expedientes
exports.getAllExpedientes = async (req, res) => {
  try {
    const expedientes = await Expediente.findAll({
      //where: { userId: req.user.id }, // Filtra por usuario actual - POR EL MOMENTO NO SE USA 
      // POR EL MOMENTO SE MUESTRAN TODOS LOS EXPEDIENTES
      order: [['createdAt', 'DESC']], // Ordena por fecha de creación, más reciente primero
    });

    res.status(200).json(expedientes);
  } catch (error) {
    console.error('Error fetching expedientes:', error);
    res.status(500).json({ error: 'Error fetching expedientes' });
  }
};

// Obtener un expediente por ID
exports.getExpedienteById = async (req, res) => {
  try {
    const { id } = req.params;

    const expediente = await Expediente.findOne({
      where: { 
        id
        //userId: req.user.id // Asegura que el usuario solo pueda ver sus propios expedientes
      },
      include: [
        {
          model: File, // Asumiendo que tienes una relación con los archivos
          attributes: ['id', 'realFileName', 'resumen', 'createdAt', 'fileType', 'tipo']
        }
      ]
    });

    if (!expediente) {
      return res.status(404).json({ error: 'Expediente not found' });
    }

    res.status(200).json(expediente);
  } catch (error) {
    console.error('Error fetching expediente:', error);
    res.status(500).json({ error: 'Error fetching expediente' });
  }
};

exports.getExpedienteFiles = async (req, res) => {
  try {
    const { id } = req.params;

    const files = await File.findAll({
      where: { 
        expedienteId: id 
      },
      attributes: [
        'id',
        'realFileName',
        'resumen',
        'createdAt',
        'updatedAt'
      ],
      order: [
        ['createdAt', 'DESC']  // Ordenar por fecha de creación descendente
      ],
      include: [
        {
          model: Expediente,
          attributes: ['id', 'numeroExpediente'],
          where: {
            id  // Verifica que el expediente exista
          }
        }
      ]
    });

    if (!files || files.length === 0) {
      return res.status(200).json({ 
        message: 'No se encontraron archivos para este expediente',
        files: [] 
      });
    }

    res.status(200).json(files);

  } catch (error) {
    console.error('Error fetching expediente files:', error);
    res.status(500).json({ 
      error: 'Error al obtener los archivos del expediente',
      details: error.message 
    });
  }
};
