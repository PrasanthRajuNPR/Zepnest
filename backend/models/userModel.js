const { pool } = require('../config/db');

const UserModel = {
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  create: async ({ name, email, password }) => {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return result.insertId;
  },

  getAll: async () => {
    const [rows] = await pool.query(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },
};

module.exports = UserModel;
