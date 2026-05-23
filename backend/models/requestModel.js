const { pool } = require('../config/db');

const RequestModel = {
  create: async ({ user_id, title, description, category, address, preferred_time, image_url }) => {
    const [result] = await pool.query(
      `INSERT INTO requests (user_id, title, description, category, address, preferred_time, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, title, description, category, address, preferred_time, image_url || null]
    );
    return result.insertId;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM requests WHERE id = ?', [id]);
    return rows[0] || null;
  },

  findByUserId: async (user_id) => {
    const [rows] = await pool.query(
      'SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  },

  deleteById: async (id) => {
    const [result] = await pool.query('DELETE FROM requests WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  updateStatus: async (id, status) => {
    const [result] = await pool.query(
      'UPDATE requests SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  },

  getAll: async (status = null) => {
    let query = `
      SELECT r.*, u.name AS user_name, u.email AS user_email
      FROM requests r
      JOIN users u ON r.user_id = u.id
    `;
    const params = [];
    if (status) {
      query += ' WHERE r.status = ?';
      params.push(status);
    }
    query += ' ORDER BY r.created_at DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  getByUserIdForAdmin: async (user_id, status = null) => {
    let query = 'SELECT * FROM requests WHERE user_id = ?';
    const params = [user_id];
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },
};

module.exports = RequestModel;
