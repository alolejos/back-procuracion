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
    allowNull: false
  },
  numeroExpediente: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  jurisdiccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombreJuzgado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numeroJuzgado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numeroSecretaria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  actora: {
    type: DataTypes.STRING,
    allowNull: false
  },
  demandada: {
    type: DataTypes.STRING,
    allowNull: false
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
  }
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
  userTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

const UserType = sequelize.define('UserType', {
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

User.belongsTo(UserType, { foreignKey: 'userTypeId' });
UserType.hasMany(User, { foreignKey: 'userTypeId' });

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

// Function to initialize models and relationships
const initModels = async () => {
  await sequelize.sync({ alter: true });
  
  // Seed data for UserType
  await UserType.bulkCreate([
    { id: 1, name: 'mesaEntradas' },
    { id: 2, name: 'direccion1' },
    { id: 3, name: 'direccion2' }
  ], { ignoreDuplicates: true });
};

module.exports = { sequelize, File, User, UserFile, UserType, initModels };
