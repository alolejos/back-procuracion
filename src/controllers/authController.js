const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Alert } = require('../models');


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, userTypeId: user.userTypeId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Buscar los alertas no leidas del usuario
    const alerts = await Alert.findAll({
      where: { sectorId: user.sectorId, estado: 'NOLEIDO' }
    });

    console.log('ALERTAS: ', alerts.length);

    res.json({
        token,
        user: {
          name: user.name,
          surname: user.surname,
          username: user.username,
          sectorId: user.sectorId,
          id: user.id,
          alerts: alerts.length
        }
      });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, name, surname, sectorId } = req.body;

    console.log('req.body::::::', req.body);

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      name,
      surname,
      sectorId
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
