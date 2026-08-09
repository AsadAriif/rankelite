const store = require('../services/store');

const getItems = async (req, res, next) => {
  try {
    const { category_id, country, search, sort, page = 1, limit = 100, offset = 0 } = req.query;

    const items = await store.getItems({
      category_id: category_id ? Number(category_id) : undefined,
      country,
      search,
      sort,
      page: Number(page),
      limit: Number(limit),
      offset: Number(offset)
    });

    res.status(200).json({ success: true, data: items, count: items.length, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

const getItemBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const item = await store.getItemBySlug(slug);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const compareItems = async (req, res, next) => {
  try {
    const { ids } = req.query; // comma-separated e.g. ids=101,201,301 or req.body.ids
    let itemIds = [];
    if (ids) {
      itemIds = String(ids).split(',').map(s => Number(s.trim())).filter(Boolean);
    } else if (req.body && req.body.ids) {
      itemIds = req.body.ids;
    }

    if (!itemIds.length) {
      return res.status(400).json({ success: false, message: 'No item IDs provided for comparison.' });
    }

    const compared = await store.compareItems(itemIds);
    res.status(200).json({ success: true, data: compared });
  } catch (err) {
    next(err);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { category_id, title, description, image_url, rank, country, custom_values, status } = req.body;

    if (!category_id || !title) {
      return res.status(400).json({ success: false, message: 'Category ID and title are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const newItem = await store.createItem({
      category_id,
      title,
      slug,
      description,
      image_url,
      rank,
      country,
      custom_values,
      status
    });

    res.status(201).json({ success: true, message: 'Item created successfully.', data: newItem });
  } catch (err) {
    next(err);
  }
};

const bulkCreateItems = async (req, res, next) => {
  try {
    const { category_id, items, replace_existing } = req.body;

    if (!category_id) {
      return res.status(400).json({ success: false, message: 'Category ID is required for bulk upload.' });
    }

    let parsedItems = items;
    if (typeof items === 'string') {
      try {
        parsedItems = JSON.parse(items);
      } catch (e) {
        // Fallback: parse CSV format
        const lines = items.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        parsedItems = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const obj = { custom_values: {} };
          headers.forEach((h, hIdx) => {
            const val = values[hIdx] || '';
            if (h === 'title') obj.title = val;
            else if (h === 'rank') obj.rank = Number(val);
            else if (h === 'country') obj.country = val;
            else if (h === 'image_url' || h === 'image') obj.image_url = val;
            else if (h === 'description') obj.description = val;
            else if (h === 'website') obj.website = val;
            else obj.custom_values[h] = val;
          });
          parsedItems.push(obj);
        }
      }
    }

    if (!Array.isArray(parsedItems) || !parsedItems.length) {
      return res.status(400).json({ success: false, message: 'No valid items found to upload.' });
    }

    const inserted = await store.bulkCreateItems({
      category_id,
      items: parsedItems,
      replace_existing: replace_existing || false
    });

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${inserted.length} items to category!`,
      count: inserted.length,
      data: inserted
    });
  } catch (err) {
    next(err);
  }
};

const bulkRankUpdate = async (req, res, next) => {
  try {
    const { updates } = req.body; // array of { id, rank }
    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'Updates array is required.' });
    }
    await store.bulkRankUpdate(updates);
    res.status(200).json({ success: true, message: 'Ranks updated successfully.' });
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedItem = await store.updateItem(id, req.body);

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    res.status(200).json({ success: true, message: 'Item updated successfully.', data: updatedItem });
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await store.deleteItem(id);
    res.status(200).json({ success: true, message: 'Item deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getItems,
  getItemBySlug,
  compareItems,
  createItem,
  bulkCreateItems,
  bulkRankUpdate,
  updateItem,
  deleteItem
};

