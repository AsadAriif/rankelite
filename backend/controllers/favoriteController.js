const store = require('../services/store');

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await store.getUserFavorites(req.user.id);
    res.status(200).json({ success: true, data: favorites });
  } catch (err) {
    next(err);
  }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ success: false, message: 'Item ID is required.' });
    }
    const result = await store.toggleFavorite(req.user.id, itemId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFavorites,
  toggleFavorite
};
