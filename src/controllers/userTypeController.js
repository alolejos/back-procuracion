const { UserType } = require('../models');

exports.getAllUserTypes = async (req, res) => {
  try {
    const userTypes = await UserType.findAll({      
      attributes: ['id', 'name'],
      order: [['id', 'ASC']]
    });

    res.status(200).json(userTypes);
  } catch (error) {
    console.error('Error fetching user types:', error);
    res.status(500).json({ error: 'Error al obtener tipos de usuario' });
  }
}; 