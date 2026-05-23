const mysql2 = require('mysql2/promise');
require('dotenv').config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  ssl: {
    rejectUnauthorized: false
  },

  connectTimeout: 10000
});

const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err,err.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
