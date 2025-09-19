const pool = require('../config/db');

const UserModel = {
  async findById(userId) {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return rows[0] || null;
  }
};

module.exports = UserModel;
