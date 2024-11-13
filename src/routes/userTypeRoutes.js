const express = require('express');
const router = express.Router();
const userTypeController = require('../controllers/userTypeController');
const auth = require('../middleware/auth');

router.get('/', auth, userTypeController.getAllUserTypes);

module.exports = router; 