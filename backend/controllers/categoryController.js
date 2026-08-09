const store = require('../services/store');

const getCategories = async (req, res, next) => {
  try {
    const categories = await store.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await store.getCategoryBySlug(slug);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, icon, banner_url, custom_fields } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await store.createCategory({
      name,
      slug: generatedSlug,
      description,
      icon,
      banner_url,
      custom_fields: custom_fields || []
    });

    res.status(201).json({ success: true, message: 'Category created successfully.', data: category });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await store.updateCategory(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.status(200).json({ success: true, message: 'Category updated successfully.', data: updated });
  } catch (err) {
    next(err);
  }
};

const createCategoryWithItems = async (req, res, next) => {
  try {
    const { category, items } = req.body;
    if (!category || !category.name) {
      return res.status(400).json({ success: false, message: 'Category information is required.' });
    }

    const result = await store.createCategoryWithItems({ category, items: items || [] });
    res.status(201).json({
      success: true,
      message: `Category created successfully with ${result.items_count} ranked items.`,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const generate100Items = async (req, res, next) => {
  try {
    const { id } = req.params;
    const generated = await store.generate100ItemsForCategory(id);
    res.status(200).json({
      success: true,
      message: `Successfully populated 100 benchmark ranked items for category!`,
      data: generated,
      count: generated.length
    });
  } catch (err) {
    next(err);
  }
};

const exportCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cat = await store.getCategoryBySlug(id);
    const items = await store.getItems({ category_id: id, limit: 500 });
    res.status(200).json({
      success: true,
      category: cat,
      items_count: items.length,
      items
    });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await store.deleteCategory(id);
    res.status(200).json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  createCategoryWithItems,
  generate100Items,
  exportCategory,
  deleteCategory
};

