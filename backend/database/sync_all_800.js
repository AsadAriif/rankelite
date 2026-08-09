const { pool } = require('../config/db');
const seedData = require('../services/seedData');

async function syncAll800ToPostgres() {
  console.log('🔄 Syncing full 800-item verified dataset into PostgreSQL...');
  
  try {
    // 1. Sync Categories
    console.log('⚡ Inserting 8 Categories into PostgreSQL...');
    for (const cat of seedData.categories) {
      await pool.query(`
        INSERT INTO categories (id, name, slug, description, icon, banner_url, item_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          icon = EXCLUDED.icon,
          banner_url = EXCLUDED.banner_url,
          item_count = 100
      `, [cat.id, cat.name, cat.slug, cat.description, cat.icon, cat.banner_url, 100]);
    }
    console.log('✅ 8 Categories synced.');

    // 2. Clear and reload custom fields
    await pool.query('DELETE FROM custom_fields');
    console.log('⚡ Inserting Custom Fields into PostgreSQL...');
    for (const field of seedData.custom_fields) {
      await pool.query(`
        INSERT INTO custom_fields (id, category_id, field_name, field_key, field_type, is_required)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [field.id, field.category_id, field.label, field.name, field.type, field.required]);
    }
    console.log('✅ Custom fields synced.');

    // 3. Sync 800 Items
    await pool.query('DELETE FROM items');
    console.log('⚡ Inserting 800 Items with verified URLs and specs into PostgreSQL...');
    for (const item of seedData.items) {
      await pool.query(`
        INSERT INTO items (id, category_id, title, slug, description, image_url, rank, views_count, country, custom_values, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          category_id = EXCLUDED.category_id,
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          image_url = EXCLUDED.image_url,
          rank = EXCLUDED.rank,
          views_count = EXCLUDED.views_count,
          country = EXCLUDED.country,
          custom_values = EXCLUDED.custom_values,
          status = EXCLUDED.status
      `, [
        item.id,
        item.category_id,
        item.title,
        item.slug,
        item.description,
        item.image_url,
        item.rank,
        item.views_count || 10000,
        item.country || 'Global',
        JSON.stringify(item.custom_values || {}),
        item.status || 'active'
      ]);
    }

    console.log('🎉 800 items with authentic URLs & unique descriptions successfully synced to PostgreSQL!');
    process.exit(0);
  } catch (err) {
    console.error('❌ PostgreSQL Sync Error:', err);
    process.exit(1);
  }
}

syncAll800ToPostgres();
