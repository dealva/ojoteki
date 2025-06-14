// cron/db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.ECOM_POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.ECOM_POSTGRES_PORT, 10) || 5432,
  user: process.env.ECOM_POSTGRES_USER,
  password: process.env.ECOM_POSTGRES_PASSWORD,
  database: process.env.ECOM_POSTGRES_DATABASE,
  max: 10,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 10000,
});

const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query,
};