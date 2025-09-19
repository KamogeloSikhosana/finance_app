const pool = require('../config/db');

const FinancialRecordModel = {
  async deleteByUserYear(userId, year) {
    await pool.query('DELETE FROM financial_records WHERE user_id = ? AND year = ?', [userId, year]);
  },

  async insertMany(records) {
    if (!records.length) return;
    const values = records.map(r => [r.user_id, r.year, r.month, r.amount]);
    await pool.query(
      'INSERT INTO financial_records (user_id, year, month, amount) VALUES ?',
      [values]
    );
  },

  async findByUserYear(userId, year) {
    const [rows] = await pool.query(
      `SELECT month, amount 
       FROM financial_records 
       WHERE user_id = ? AND year = ? 
       ORDER BY FIELD(month, 
        "January","February","March","April","May","June",
        "July","August","September","October","November","December")`,
      [userId, year]
    );
    return rows;
  }
};

module.exports = FinancialRecordModel;
