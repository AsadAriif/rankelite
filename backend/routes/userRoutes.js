const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticate, requireAdmin, getUsers);
router.put('/:id/role', authenticate, requireAdmin, updateUserRole);
router.delete('/:id', authenticate, requireAdmin, deleteUser);

module.exports = router;
