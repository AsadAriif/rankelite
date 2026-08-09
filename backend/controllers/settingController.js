const store = require('../services/store');

const getSettings = async (req, res, next) => {
  try {
    const settings = await store.getSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settingsObj = req.body;
    const updated = await store.updateSettings(settingsObj);
    res.status(200).json({ success: true, message: 'Settings updated successfully.', data: updated });
  } catch (err) {
    next(err);
  }
};

const exportDatabase = async (req, res, next) => {
  try {
    const backup = await store.exportFullDatabase();
    res.status(200).json({ success: true, data: backup });
  } catch (err) {
    next(err);
  }
};

const importDatabase = async (req, res, next) => {
  try {
    const importedData = req.body;
    const result = await store.importFullDatabase(importedData);
    res.status(200).json({
      success: true,
      message: `Database restored successfully (${result.categories_count} categories, ${result.items_count} items).`,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  exportDatabase,
  importDatabase
};

