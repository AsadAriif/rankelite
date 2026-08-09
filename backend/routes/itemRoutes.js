const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemBySlug,
  compareItems,
  createItem,
  bulkCreateItems,
  bulkRankUpdate,
  updateItem,
  deleteItem
} = require('../controllers/itemController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getItems);
router.get('/compare', compareItems);
router.post('/compare', compareItems);
router.get('/:slug', getItemBySlug);
router.post('/', authenticate, requireAdmin, createItem);
router.post('/bulk', authenticate, requireAdmin, bulkCreateItems);
router.post('/bulk-rank-update', authenticate, requireAdmin, bulkRankUpdate);
router.put('/:id', authenticate, requireAdmin, updateItem);
router.delete('/:id', authenticate, requireAdmin, deleteItem);

module.exports = router;

