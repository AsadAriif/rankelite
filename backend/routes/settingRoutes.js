const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, exportDatabase, importDatabase } = require('../controllers/settingController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getSettings);
router.post('/', authenticate, requireAdmin, updateSettings);
router.get('/export-db', authenticate, requireAdmin, exportDatabase);
router.post('/import-db', authenticate, requireAdmin, importDatabase);

module.exports = router;

