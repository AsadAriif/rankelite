const store = require('../services/store');

const getUsers = async (req, res, next) => {
  try {
    const users = await store.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }
    const updatedUser = await store.updateUserRole(id, role);
    res.status(200).json({ success: true, message: 'User role updated.', data: updatedUser });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await store.deleteUser(id);
    res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser
};
