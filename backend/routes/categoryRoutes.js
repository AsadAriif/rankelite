const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  createCategoryWithItems,
  generate100Items,
  exportCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.get('/:id/export', authenticate, requireAdmin, exportCategory);
router.post('/', authenticate, requireAdmin, createCategory);
router.post('/with-items', authenticate, requireAdmin, createCategoryWithItems);
router.post('/:id/generate-100', authenticate, requireAdmin, generate100Items);
router.put('/:id', authenticate, requireAdmin, updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

module.exports = router;

