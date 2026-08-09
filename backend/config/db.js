const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'eliterank_db',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

let isPostgresConnected = false;

// Attempt initial connection test
pool.connect((err, client, release) => {
  if (err) {
    console.warn('⚠️  PostgreSQL connection failed. Operating in High-Performance In-Memory DB mode.');
    isPostgresConnected = false;
  } else {
    isPostgresConnected = true;
    console.log('⚡ PostgreSQL Database connected successfully!');
    release();
  }
});

module.exports = {
  pool,
  query: async (text, params) => {
    if (isPostgresConnected) {
      try {
        return await pool.query(text, params);
      } catch (err) {
        console.error('PostgreSQL Query Error:', err.message);
        throw err;
      }
    } else {
      throw new Error('Database connection offline');
    }
  },
  isPostgresConnected: () => isPostgresConnected
};
