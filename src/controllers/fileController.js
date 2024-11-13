const AWS = require('aws-sdk');
const { File, Expediente } = require('../models');
const axios = require('axios');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

exports.generatepresignedurl = async (req, res) => {

  const params = {
    Bucket: 'procuracion-repo-bucket',
    Key: req.body.fileName,
    Expires: 60, // Expira en 60 segundos
    ContentType: req.body.fileType,
  };
  
  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      console.log('ERROR que devuelve el s3::::::', err);
      return res.status(500).json({ error: 'Error generando la URL pre-firmada' });
    }
    res.json({ url });
  });
};

// ENDPOINT PARA GUARDAR LA INFORMACION DEL ARCHIVO EN LA BASE DE DATOS
exports.saveFile = async (req, res) => {
  try {
    const { fileName, realFileName, fileType } = req.body;

    // Validar que se recibieron todos los datos necesarios
    if (!fileName || !realFileName || !fileType) {
      return res.status(400).json({ error: 'fileName, realFileName, and fileType are required' });
    }

    // Crear un nuevo registro en la base de datos
    const newFile = await File.create({
      fileName: fileName, // El hash del archivo
      realFileName: realFileName, // El nombre real del archivo
      fileType: fileType,// El tipo de archivo
      mimetype: fileType, 
      expedienteId: 1,
      // Puedes agregar más campos si es necesario
    });

    res.status(201).json({ message: 'File information saved successfully', file: newFile });
  } catch (error) {
    console.error('Error saving file information:', error);
    res.status(500).json({ error: 'Error saving file information' });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching files' });
  }
};

exports.updateFile = async (req, res) => {
  let newExpediente = false;
  try {
    console.log('req.body: ', req.body);
    const { fileId } = req.params;
    let tipo = req.body.mlData.tipo;
    const { 
      CUIJ, 
      Criticidad,
      Fuero,
      Instancia,
      Juzgado,
      Resumen,
      Secretaria,
      Tematica,
      TipoDeAccion 
    } = req.body.mlData[tipo];

    // Buscar o crear el expediente
    let expediente = await Expediente.findOne({
      where: {
        numeroExpediente: CUIJ
      },
      defaults: {
        // Otros campos por defecto si son necesarios
        estado: 'ACTIVO'
      }
    });

    if (!expediente) {
      newExpediente = true;
      expediente = await Expediente.create({
        numeroExpediente: CUIJ,
        fuero: Fuero,
        numeroJuzgado: Juzgado,
        numeroSecretaria: Secretaria,
        sectorId: 1
      });
    }    
     // Actualizar el archivo con el id del expediente y el resumen
    const updatedFile = await File.update(
      {
        expedienteId: expediente.id,
        tipo: tipo
      },
      {
        where: { id: fileId }
      }
    );

    if (updatedFile[0] === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
   
    res.status(200).json({ 
      message: 'Archivo actualizado exitosamente',
      expediente: expediente,
      newExpediente
    });

  } catch (error) {
    console.error('Error en updateFile:', error);
    res.status(500).json({ 
      error: 'Error al actualizar el archivo',
      details: error.message 
    });
  }
};
