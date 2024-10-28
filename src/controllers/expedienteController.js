const { Expediente } = require('../models');

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
      userId: req.user.id // Asumiendo que tienes el ID del usuario en req.user
    });

    res.status(201).json({ message: 'Expediente created successfully', expediente: newExpediente });
  } catch (error) {
    console.error('Error creating expediente:', error);
    res.status(500).json({ error: 'Error creating expediente' });
  }
};
