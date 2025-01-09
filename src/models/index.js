const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, config);


const Expediente = sequelize.define('Expediente', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  caratula: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numeroExpediente: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  jurisdiccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fuero: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nombreJuzgado: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numeroJuzgado: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numeroSecretaria: {
    type: DataTypes.STRING,
    allowNull: true
  },
  actora: {
    type: DataTypes.STRING,
    allowNull: true
  },
  demandada: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sectorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

const File = sequelize.define('File', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  realFileName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: true
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mlAnalysisResults: {
    type: DataTypes.JSON,
    allowNull: true
  },
  resumen: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expedienteId: {
    type: DataTypes.UUID,
    allowNull: true
  },
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sectorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

const Sector = sequelize.define('Sector', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

const Reporte = sequelize.define('Reporte', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tipoArchivo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipoAccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tematica: {
    type: DataTypes.STRING,
    allowNull: true
  },
  criticidad: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rolGcba: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instancia: {
    type: DataTypes.STRING,
    allowNull: true
  },
  juzgado: {
    type: DataTypes.STRING,
    allowNull: true
  },
  secretaria: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fuero: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numeroExpediente: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resumen: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  resumen: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('LEIDO', 'NOLEIDO'),
    defaultValue: 'NOLEIDO'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  sectorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sectors',
      key: 'id'
    }
  },
  expedienteId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Expedientes',
      key: 'id'
    }
  },
  fileId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Files',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

User.belongsTo(Sector, { foreignKey: 'sectorId' });
Sector.hasMany(User, { foreignKey: 'sectorId' });

// Define the many-to-many relationship
const UserFile = sequelize.define('UserFile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  }
});

User.belongsToMany(File, { through: UserFile });
File.belongsToMany(User, { through: UserFile });

Expediente.hasMany(File, { foreignKey: 'expedienteId' }); // Un expediente puede tener varios archivos
File.belongsTo(Expediente, { foreignKey: 'expedienteId' }); // Un archivo pertenece a un expediente

// Relación entre Expediente y User
Expediente.belongsTo(User, { foreignKey: 'userId' }); // Un expediente pertenece a un usuario
User.hasMany(Expediente, { foreignKey: 'userId' }); // Un usuario puede tener varios expedientes
// Relaciones

Reporte.belongsTo(File, { foreignKey: 'fileId' }); // Un reporte pertenece a un archivo
File.hasOne(Reporte, { foreignKey: 'fileId' }); // Un archivo puede tener un reporte

// Relaciones para Alert
Alert.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'usuario'
}); 
User.hasMany(Alert, { 
  foreignKey: 'userId',
  as: 'alertas'
});

Alert.belongsTo(Sector, { 
  foreignKey: 'sectorId',
  as: 'sector'
}); 
Sector.hasMany(Alert, { 
  foreignKey: 'sectorId',
  as: 'alertas'
});

Alert.belongsTo(Expediente, { 
  foreignKey: 'expedienteId',
  as: 'expediente'
}); 
Expediente.hasMany(Alert, { 
  foreignKey: 'expedienteId',
  as: 'alertas'
});

Alert.belongsTo(File, { 
  foreignKey: 'fileId',
  as: 'documento'
}); 
File.hasOne(Alert, { 
  foreignKey: 'fileId',
  as: 'alerta'
});
Expediente.belongsTo(Sector, { 
  foreignKey: 'sectorId',
  as: 'sector'
}); 
Sector.hasMany(Expediente, { 
  foreignKey: 'sectorId',
  as: 'expedientes'
});

// Asociaciones para Reporte
Reporte.belongsTo(File, { 
  foreignKey: 'fileId',
  as: 'file'
}); 

File.hasOne(Reporte, { 
  foreignKey: 'fileId',
  as: 'reporte'
});

// Function to initialize models and relationships
const initModels = async () => {
  await sequelize.sync({ alter: true });
  
  // Seed data for Sector
  await Sector.bulkCreate([
    { id: 1, name: 'mesaEntradas' },
    { id: 2, name: 'direccion1' },
    { id: 3, name: 'direccion2' }
  ], { ignoreDuplicates: true });
};

module.exports = { 
  sequelize, 
  File, 
  User, 
  UserFile, 
  Sector, 
  Expediente,
  Reporte, 
  Alert, 
  initModels
};
