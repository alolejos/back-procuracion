const { User, UserType } = require('../models');

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    console.log('que llega al GET PROFILE: ', req.user);
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['id', 'username', 'name', 'surname', 'userTypeId'],
      include: [{
        model: UserType,
        attributes: ['id', 'name']
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};

// Actualizar perfil del usuario
exports.updateProfile = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body;

    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el email ya existe (si se está cambiando)
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }
    }

    await user.update({
      nombre,
      apellido,
      email
    });

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
}; 