const { Reporte, File, User } = require('../models');

exports.createReporte = async (req, res) => {
  console.log('REQ::::::', req.body);
  try {
    let datos = req.body.fileData;

    const tipoPropiedad = datos.tipo;
    // Crear el reporte
    const newReporte = await Reporte.create({
      tipoArchivo: datos.tipo,
      tipoAccion: datos[tipoPropiedad]?.TipoDeAccion ?? null,
      tematica: datos[tipoPropiedad]?.Tematica ?? null,
      criticidad: datos[tipoPropiedad]?.Criticidad ?? null,
      instancia: datos[tipoPropiedad]?.Instancia ?? null,
      juzgado: datos[tipoPropiedad]?.Juzgado ?? null,
      secretaria: datos[tipoPropiedad]?.Secretaria ?? null,
      fuero: datos[tipoPropiedad]?.Fuero ?? null,
      numeroExpediente: datos[tipoPropiedad]?.CUIJ ?? null,
      resumen: datos[tipoPropiedad]?.Resumen ?? null,
      fileId: req.body.fileId
    });

    res.status(201).json({
      message: 'Reporte created successfully',
      reporte: newReporte
    });
  } catch (error) {
    console.error('Error creating reporte:', error);
    res.status(500).json({ error: 'Error creating reporte' });
  }
};

exports.getReportes = async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      include: [
        {
          model: File,
          as: 'file',
          attributes: ['realFileName', 'tipo', 'fileName', 'url']
        }
      ]
    });

    res.json(reportes);
  } catch (error) {
    console.error('Error fetching reportes:', error);
    res.status(500).json({ 
      error: 'Error al obtener los reportes',
      details: error.message 
    });
  }
};

exports.getReporteById = async (req, res) => {
  try {
    const reporte = await Reporte.findByPk(req.params.id, {
      include: [
        {
          model: File,
          as: 'file',
          attributes: ['realFileName', 'tipo', 'fileName', 'url']
        }
        // Si realmente necesitas la información del usuario, descomenta estas líneas
        // después de agregar la columna userId a la tabla Reportes
        /*,
        {
          model: User,
          as: 'user',
          attributes: ['username', 'name', 'surname']
        }
        */
      ]
    });

    if (!reporte) {
      return res.status(404).json({ 
        error: 'Reporte no encontrado' 
      });
    }

    res.json(reporte);
  } catch (error) {
    console.error('Error fetching reporte:', error);
    res.status(500).json({ 
      error: 'Error al obtener el reporte',
      details: error.message 
    });
  }
};
