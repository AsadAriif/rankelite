const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticate, requireAdmin, getAnalytics);

module.exports = router;
