const db = require('../config/db');

const AdminModel = {
  // Find admin by email
  async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM admins WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  // Find admin by ID
  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, created_at FROM admins WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = AdminModel;
