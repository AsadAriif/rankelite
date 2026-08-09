const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function initDB() {
  console.log('🔄 Initializing PostgreSQL Database Schema & Seed Data...');
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

    console.log('⚡ Executing schema.sql...');
    await pool.query(schemaSql);
    console.log('✅ Schema tables created.');

    console.log('⚡ Executing seed.sql...');
    await pool.query(seedSql);
    console.log('🎉 Seed data populated successfully!');

    process.exit(0);
  } catch (err) {
    console.error('❌ DB Initialization Failed:', err.message);
    process.exit(1);
  }
}

initDB();
