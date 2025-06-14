import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.ECOM_POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.ECOM_POSTGRES_PORT, 10) || 5432,
  user: process.env.ECOM_POSTGRES_USER,
  password: process.env.ECOM_POSTGRES_PASSWORD,
  database: process.env.ECOM_POSTGRES_DATABASE,
  max: 10,             // max number of clients in the pool
  idleTimeoutMillis: 60000,  // close idle clients after 1 minute
  connectionTimeoutMillis: 10000, // timeout for acquiring a new clie nt
});

// simple helper to query
export const query = (text, params) => pool.query(text, params);
