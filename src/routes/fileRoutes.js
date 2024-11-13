const express = require('express');
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All file routes are protected by the authMiddleware
router.use(authMiddleware);

router.post('/generate-presigned-url', fileController.generatepresignedurl);
router.post('/save-file-data', fileController.saveFile);
router.get('/', fileController.getFiles);
router.put('/update/:fileId', fileController.updateFile);
// Add more file-related routes as needed

module.exports = router;
