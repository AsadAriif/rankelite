const store = require('../services/store');

const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await store.getAnalytics();
    res.status(200).json({ success: true, data: analytics });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAnalytics
};
