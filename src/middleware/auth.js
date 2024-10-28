const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers['authorization'];

    console.log('REQ::::::', req);

    console.log('TOKEN::::::', token);

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log('DECODED::::::', decoded);
    console.log('process.env.JWT_SECRET::::::', process.env.JWT_SECRET);
      if (err) {
        console.log('ERROR::::::', err);
        return res.status(403).json({ error: 'Failed to authenticate token' });
      }
      console.log('DECODED = USER = PASO POR EL MIDDLEWARE::::::', decoded);
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
