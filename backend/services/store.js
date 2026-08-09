const db = require('../config/db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const seedData = require('./seedData');

const DATA_STORE_PATH = path.join(__dirname, '../database/data_store.json');

// Initialize In-Memory / File-Backed Data Store
let fallbackData = {
  users: [
    {
      id: 1,
      name: 'Admin VIP',
      email: 'admin@eliterank.com',
      password_hash: bcrypt.hashSync('Admin123!', 10),
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      created_at: new Date()
    },
    {
      id: 2,
      name: 'John Concierge',
      email: 'user@eliterank.com',
      password_hash: bcrypt.hashSync('User123!', 10),
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      created_at: new Date()
    }
  ],
  categories: seedData.categories,
  custom_fields: seedData.custom_fields,
  items: seedData.items,
  favorites: [
    { id: 1, user_id: 1, item_id: 101 },
    { id: 2, user_id: 1, item_id: 201 },
    { id: 3, user_id: 1, item_id: 801 },
    { id: 4, user_id: 2, item_id: 101 },
    { id: 5, user_id: 2, item_id: 201 }
  ],
  settings: {
    site_name: 'EliteRank',
    site_tagline: 'The Definitive Global 100-Tier Luxury, Power & Excellence Rankings',
    hero_title: 'The 100 Global Ranks of Power, Luxury & Domination',
    hero_subtitle: 'Curated telemetry across 8 global sectors. From 100 European football powerhouses to 1,800HP hypercars and tech titan market caps.',
    contact_email: 'concierge@eliterank.com',
    featured_categories_count: '8',
    comparison_enabled: 'true',
    official_links_enabled: 'true',
    ticker_text: '📱 #1 Mobile: iPhone 15 Pro Max | 👑 #1 Billionaire: Elon Musk ($242.0B) | 🏎️ #1 Hypercar: Bugatti Tourbillon (1,800 HP) | ⚽ #1 Football: Real Madrid CF (15 UCL) | 🎓 #1 University: Harvard University'
  }
};

// Load saved data from disk file on boot if available
const loadFromDisk = () => {
  try {
    if (fs.existsSync(DATA_STORE_PATH)) {
      const raw = fs.readFileSync(DATA_STORE_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.categories) && Array.isArray(parsed.items)) {
        fallbackData = { ...fallbackData, ...parsed };
        console.log(`💾 Loaded database from disk: ${fallbackData.categories.length} categories, ${fallbackData.items.length} items.`);
      }
    } else {
      saveToDisk();
    }
  } catch (err) {
    console.error('Error loading data from disk:', err.message);
  }
};

// Save current state immediately to disk file
const saveToDisk = () => {
  try {
    const dir = path.dirname(DATA_STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(fallbackData, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving data to disk:', err.message);
  }
};

loadFromDisk();

class StoreService {
  // USERS
  async findUserByEmail(email) {
    if (db.isPostgresConnected()) {
      try {
        const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (res && res.rows && res.rows[0]) return res.rows[0];
      } catch (e) {
        console.warn('Postgres query fallback:', e.message);
      }
    }
    return fallbackData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    if (db.isPostgresConnected()) {
      try {
        const res = await db.query('SELECT id, name, email, role, avatar, created_at FROM users WHERE id = $1', [id]);
        if (res && res.rows && res.rows[0]) return res.rows[0];
      } catch (e) {
        console.warn('Postgres query fallback:', e.message);
      }
    }
    const user = fallbackData.users.find(u => u.id === Number(id));
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  async createUser({ name, email, password, role = 'user', avatar = '' }) {
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = {
      id: fallbackData.users.length ? Math.max(...fallbackData.users.map(u => u.id)) + 1 : 1,
      name,
      email,
      password_hash,
      role,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      created_at: new Date()
    };

    if (db.isPostgresConnected()) {
      try {
        const res = await db.query(
          'INSERT INTO users (name, email, password_hash, role, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, avatar, created_at',
          [name, email, password_hash, role, avatar]
        );
        if (res && res.rows && res.rows[0]) {
          newUser.id = res.rows[0].id;
        }
      } catch (e) {
        console.warn('Postgres user insert fallback:', e.message);
      }
    }

    fallbackData.users.push(newUser);
    saveToDisk();
    const { password_hash: _, ...safeUser } = newUser;
    return safeUser;
  }

  async getAllUsers() {
    if (db.isPostgresConnected()) {
      try {
        const res = await db.query('SELECT id, name, email, role, avatar, created_at FROM users ORDER BY created_at DESC');
        if (res && res.rows) return res.rows;
      } catch (e) {
        console.warn('Postgres users fetch fallback:', e.message);
      }
    }
    return fallbackData.users.map(({ password_hash, ...rest }) => rest);
  }

  async updateUserRole(id, role) {
    if (db.isPostgresConnected()) {
      try {
        await db.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role', [role, id]);
      } catch (e) {
        console.warn('Postgres user role update fallback:', e.message);
      }
    }
    const user = fallbackData.users.find(u => u.id === Number(id));
    if (user) {
      user.role = role;
      saveToDisk();
    }
    return user;
  }

  async deleteUser(id) {
    if (db.isPostgresConnected()) {
      try {
        await db.query('DELETE FROM users WHERE id = $1', [id]);
      } catch (e) {
        console.warn('Postgres delete user fallback:', e.message);
      }
    }
    fallbackData.users = fallbackData.users.filter(u => u.id !== Number(id));
    saveToDisk();
    return true;
  }

  // CATEGORIES
  async getAllCategories() {
    const list = fallbackData.categories.map(c => {
      const count = fallbackData.items.filter(i => i.category_id === c.id).length;
      return { ...c, item_count: count || c.item_count || 0 };
    });
    return list;
  }

  async getCategoryBySlug(slug) {
    const cat = fallbackData.categories.find(c => c.slug.toLowerCase() === slug.toLowerCase() || String(c.id) === slug);
    if (!cat) return null;
    const fields = fallbackData.custom_fields.filter(f => f.category_id === cat.id);
    return { ...cat, custom_fields: fields };
  }

  async createCategory({ name, slug, description = '', icon = 'Layers', banner_url = '', custom_fields = [] }) {
    const nextId = fallbackData.categories.length ? Math.max(...fallbackData.categories.map(c => c.id)) + 1 : 1;
    const newCat = {
      id: nextId,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description,
      icon: icon || 'Layers',
      banner_url: banner_url || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80',
      item_count: 0
    };

    if (db.isPostgresConnected()) {
      try {
        const res = await db.query(
          'INSERT INTO categories (name, slug, description, icon, banner_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [newCat.name, newCat.slug, newCat.description, newCat.icon, newCat.banner_url]
        );
        if (res && res.rows && res.rows[0]) newCat.id = res.rows[0].id;
      } catch (e) {
        console.warn('Postgres category insert fallback:', e.message);
      }
    }

    fallbackData.categories.push(newCat);

    if (custom_fields && custom_fields.length > 0) {
      custom_fields.forEach(f => {
        const nextFieldId = fallbackData.custom_fields.length ? Math.max(...fallbackData.custom_fields.map(cf => cf.id)) + 1 : 1;
        fallbackData.custom_fields.push({
          id: nextFieldId,
          category_id: newCat.id,
          field_name: f.field_name,
          field_key: f.field_key || f.field_name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          field_type: f.field_type || 'text',
          is_required: f.is_required || false
        });
      });
    }

    saveToDisk();
    return newCat;
  }

  async updateCategory(id, { name, slug, description, icon, banner_url, custom_fields }) {
    const cat = fallbackData.categories.find(c => c.id === Number(id));
    if (!cat) return null;

    if (name !== undefined) cat.name = name;
    if (slug !== undefined) cat.slug = slug;
    if (description !== undefined) cat.description = description;
    if (icon !== undefined) cat.icon = icon;
    if (banner_url !== undefined) cat.banner_url = banner_url;

    if (Array.isArray(custom_fields)) {
      // Remove old fields for this category and insert new
      fallbackData.custom_fields = fallbackData.custom_fields.filter(f => f.category_id !== Number(id));
      custom_fields.forEach(f => {
        const nextFieldId = fallbackData.custom_fields.length ? Math.max(...fallbackData.custom_fields.map(cf => cf.id)) + 1 : 1;
        fallbackData.custom_fields.push({
          id: nextFieldId,
          category_id: Number(id),
          field_name: f.field_name,
          field_key: f.field_key || f.field_name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          field_type: f.field_type || 'text',
          is_required: f.is_required || false
        });
      });
    }

    if (db.isPostgresConnected()) {
      try {
        await db.query(
          'UPDATE categories SET name = $1, slug = $2, description = $3, icon = $4, banner_url = $5 WHERE id = $6',
          [cat.name, cat.slug, cat.description, cat.icon, cat.banner_url, id]
        );
      } catch (e) {
        console.warn('Postgres category update fallback:', e.message);
      }
    }

    saveToDisk();
    return cat;
  }

  async deleteCategory(id) {
    fallbackData.categories = fallbackData.categories.filter(c => c.id !== Number(id));
    fallbackData.custom_fields = fallbackData.custom_fields.filter(f => f.category_id !== Number(id));
    fallbackData.items = fallbackData.items.filter(i => i.category_id !== Number(id));
    if (db.isPostgresConnected()) {
      try {
        await db.query('DELETE FROM categories WHERE id = $1', [id]);
      } catch (e) {
        console.warn('Postgres delete category fallback:', e.message);
      }
    }
    saveToDisk();
    return true;
  }

  // CREATE CATEGORY AND ITS 100 ITEMS SIMULTANEOUSLY
  async createCategoryWithItems({ category, items = [] }) {
    const createdCat = await this.createCategory(category);
    
    // If items were passed, attach them to the new category
    let createdItems = [];
    if (items && items.length > 0) {
      createdItems = await this.bulkCreateItems({
        category_id: createdCat.id,
        items
      });
    }

    return {
      category: createdCat,
      items: createdItems,
      items_count: createdItems.length
    };
  }

  // AUTO-GENERATE 100 BENCHMARK ITEMS FOR ANY CATEGORY
  async generate100ItemsForCategory(categoryId) {
    const cat = fallbackData.categories.find(c => c.id === Number(categoryId));
    if (!cat) throw new Error('Category not found');

    const fields = fallbackData.custom_fields.filter(f => f.category_id === Number(categoryId));
    const items = [];

    const defaultImages = [
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'
    ];

    const countries = ['United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Switzerland', 'Japan', 'Sweden', 'Spain', 'Singapore', 'UAE'];

    for (let r = 1; r <= 100; r++) {
      const custom_values = {};
      fields.forEach(f => {
        if (f.field_key.includes('speed') || f.field_key.includes('hp') || f.field_key.includes('power')) {
          custom_values[f.field_key] = `${1200 - r * 8} HP`;
        } else if (f.field_key.includes('worth') || f.field_key.includes('value') || f.field_key.includes('price') || f.field_key.includes('cap')) {
          custom_values[f.field_key] = `$${(250 - r * 2.2).toFixed(1)}B`;
        } else if (f.field_key.includes('website') || f.field_key.includes('portal')) {
          custom_values[f.field_key] = `https://www.google.com/search?q=${encodeURIComponent(`${cat.name} Rank ${r}`)}`;
        } else {
          custom_values[f.field_key] = `Verified Tier ${r}`;
        }
      });
      if (!custom_values.website) {
        custom_values.website = `https://www.google.com/search?q=${encodeURIComponent(`${cat.name} Rank ${r}`)}`;
      }

      items.push({
        category_id: cat.id,
        title: `${cat.name.replace(/s$/i, '')} Elite Model #${r}`,
        rank: r,
        country: countries[r % countries.length],
        description: `Certified #${r} global benchmark profile in the official 100-tier ${cat.name} index with live audited telemetry.`,
        image_url: defaultImages[r % defaultImages.length],
        custom_values,
        status: 'active'
      });
    }

    return await this.bulkCreateItems({ category_id: cat.id, items, replace_existing: true });
  }

  // BULK CREATE / UPLOAD 100 ITEMS
  async bulkCreateItems({ category_id, items = [], replace_existing = false }) {
    const catId = Number(category_id);
    if (!catId) throw new Error('Category ID is required for bulk upload');

    if (replace_existing) {
      fallbackData.items = fallbackData.items.filter(i => i.category_id !== catId);
    }

    const inserted = [];
    let baseId = fallbackData.items.length ? Math.max(...fallbackData.items.map(i => i.id)) + 1 : 1000;

    for (let index = 0; index < items.length; index++) {
      const row = items[index];
      const rankVal = Number(row.rank) || (index + 1);
      const title = row.title || `Rank #${rankVal} Item`;
      const generatedSlug = (row.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) + `-${catId}-${rankVal}`;

      const itemObj = {
        id: baseId++,
        category_id: catId,
        title,
        slug: generatedSlug,
        description: row.description || `Verified Rank #${rankVal} profile.`,
        image_url: row.image_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
        rank: rankVal,
        views_count: Math.floor(Math.random() * 50) + 1,
        country: row.country || 'Global',
        custom_values: typeof row.custom_values === 'object' ? row.custom_values : {},
        status: row.status || 'active'
      };

      if (!itemObj.custom_values.website && row.website) {
        itemObj.custom_values.website = row.website;
      }

      fallbackData.items.push(itemObj);
      inserted.push(itemObj);
    }

    saveToDisk();
    return inserted;
  }

  // BATCH RE-RANKING UPDATE
  async bulkRankUpdate(updates = []) {
    updates.forEach(u => {
      const itm = fallbackData.items.find(i => i.id === Number(u.id));
      if (itm && u.rank !== undefined) {
        itm.rank = Number(u.rank);
      }
    });
    saveToDisk();
    return true;
  }

  // ITEMS
  async getItems({ category_id, search, country, sort = 'rank_asc', limit = 100, offset = 0 } = {}) {
    let filtered = [...fallbackData.items];

    if (category_id) {
      filtered = filtered.filter(i => i.category_id === Number(category_id));
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(i => {
        const cat = fallbackData.categories.find(c => c.id === i.category_id);
        const catName = cat ? cat.name.toLowerCase() : '';
        const specs = JSON.stringify(i.custom_values || {}).toLowerCase();
        return i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          (i.country && i.country.toLowerCase().includes(q)) ||
          catName.includes(q) ||
          specs.includes(q);
      });
    }

    if (country) {
      filtered = filtered.filter(i => i.country && i.country.toLowerCase() === country.toLowerCase());
    }

    // Sorting
    if (sort === 'rank_asc') filtered.sort((a, b) => a.rank - b.rank);
    else if (sort === 'rank_desc') filtered.sort((a, b) => b.rank - a.rank);
    else if (sort === 'views_desc') filtered.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
    else if (sort === 'title_asc') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'title_desc') filtered.sort((a, b) => b.title.localeCompare(a.title));
    else filtered.sort((a, b) => a.rank - b.rank);

    // Attach Category Info
    const enriched = filtered.map(item => {
      const cat = fallbackData.categories.find(c => c.id === item.category_id);
      return {
        ...item,
        category_name: cat ? cat.name : '',
        category_slug: cat ? cat.slug : '',
        category_icon: cat ? cat.icon : 'Layers'
      };
    });

    const parsedOffset = Number(offset) || 0;
    const parsedLimit = Number(limit) || 100;
    return enriched.slice(parsedOffset, parsedOffset + parsedLimit);
  }

  async getItemBySlug(slug) {
    const item = fallbackData.items.find(i => i.slug.toLowerCase() === slug.toLowerCase() || String(i.id) === slug);
    if (!item) return null;
    item.views_count = (item.views_count || 0) + 1;
    saveToDisk();
    const cat = fallbackData.categories.find(c => c.id === item.category_id);
    const fields = fallbackData.custom_fields.filter(f => f.category_id === item.category_id);
    return {
      ...item,
      category_name: cat ? cat.name : '',
      category_slug: cat ? cat.slug : '',
      category_icon: cat ? cat.icon : 'Layers',
      custom_fields: fields
    };
  }

  async createItem({ category_id, title, slug, description, image_url, rank, country, custom_values, status = 'active' }) {
    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    const nextId = fallbackData.items.length ? Math.max(...fallbackData.items.map(i => i.id)) + 1 : 1000;
    const newItem = {
      id: nextId,
      category_id: Number(category_id),
      title,
      slug: generatedSlug,
      description,
      image_url: image_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
      rank: Number(rank) || 1,
      views_count: 1,
      country: country || '',
      custom_values: custom_values || {},
      status
    };
    fallbackData.items.push(newItem);
    saveToDisk();
    return newItem;
  }

  async updateItem(id, { title, description, image_url, rank, country, custom_values, status }) {
    const item = fallbackData.items.find(i => i.id === Number(id));
    if (!item) return null;

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (image_url !== undefined) item.image_url = image_url;
    if (rank !== undefined) item.rank = Number(rank);
    if (country !== undefined) item.country = country;
    if (custom_values !== undefined) item.custom_values = custom_values;
    if (status !== undefined) item.status = status;

    saveToDisk();
    return item;
  }

  async deleteItem(id) {
    fallbackData.items = fallbackData.items.filter(i => i.id !== Number(id));
    saveToDisk();
    return true;
  }

  // COMPARISON ENGINE
  async compareItems(itemIds = []) {
    const ids = itemIds.map(id => Number(id));
    const itemsToCompare = fallbackData.items.filter(i => ids.includes(i.id));
    
    return itemsToCompare.map(item => {
      const cat = fallbackData.categories.find(c => c.id === item.category_id);
      const fields = fallbackData.custom_fields.filter(f => f.category_id === item.category_id);
      return {
        ...item,
        category_name: cat ? cat.name : '',
        category_slug: cat ? cat.slug : '',
        custom_fields: fields
      };
    });
  }

  // FAVORITES
  async getUserFavorites(userId) {
    const favs = fallbackData.favorites.filter(f => f.user_id === Number(userId));
    return favs.map(f => {
      const item = fallbackData.items.find(i => i.id === f.item_id);
      const cat = item ? fallbackData.categories.find(c => c.id === item.category_id) : null;
      return {
        favorite_id: f.id,
        ...item,
        category_name: cat ? cat.name : '',
        category_slug: cat ? cat.slug : ''
      };
    }).filter(Boolean);
  }

  async toggleFavorite(userId, itemId) {
    const existingIdx = fallbackData.favorites.findIndex(f => f.user_id === Number(userId) && f.item_id === Number(itemId));
    if (existingIdx !== -1) {
      fallbackData.favorites.splice(existingIdx, 1);
      saveToDisk();
      return { isFavorite: false };
    } else {
      fallbackData.favorites.push({ id: fallbackData.favorites.length + 1, user_id: Number(userId), item_id: Number(itemId) });
      saveToDisk();
      return { isFavorite: true };
    }
  }

  // SETTINGS & DATABASE BACKUP
  async getSettings() {
    return fallbackData.settings;
  }

  async updateSetting(key, value) {
    if (db.isPostgresConnected()) {
      await db.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_at = NOW()',
        [key, value]
      );
    } else {
      fallbackData.settings[key] = value;
    }
    return true;
  }

  async getAnalytics() {
    let totalUsers = fallbackData.users.length;
    let totalCategories = fallbackData.categories.length;
    let totalItems = fallbackData.items.length;
    let totalViews = fallbackData.items.reduce((acc, i) => acc + (i.views_count || 0), 0);

    if (db.isPostgresConnected()) {
      const uRes = await db.query('SELECT COUNT(*) FROM users');
      const cRes = await db.query('SELECT COUNT(*) FROM categories');
      const iRes = await db.query('SELECT COUNT(*) FROM items');
      const vRes = await db.query('SELECT SUM(views_count) FROM items');

      totalUsers = parseInt(uRes.rows[0].count);
      totalCategories = parseInt(cRes.rows[0].count);
      totalItems = parseInt(iRes.rows[0].count);
      totalViews = parseInt(vRes.rows[0].sum || 0);
    }

    const topItems = await this.getItems({ sort: 'views_desc', limit: 6 });

    return {
      stats: {
        totalUsers,
        totalCategories,
        totalItems,
        totalViews
      },
      topItems
    };
  }
}

module.exports = new StoreService();
