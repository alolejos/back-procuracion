const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

// Example of a protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;