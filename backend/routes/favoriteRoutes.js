const express = require('express');
const router = express.Router();
const { getFavorites, toggleFavorite } = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getFavorites);
router.post('/toggle', authenticate, toggleFavorite);

module.exports = router;
