const UserModel = require('../models/UserModel');
const FinancialRecordModel = require('../models/FinancialRecordModel');
const { parseExcel } = require('../services/excelService');

const uploadFile = async (req, res) => {
  try {
    const { userId, year } = req.params;
    if (!req.file) return res.status(400).json({ error: 'File is required' });

    const records = parseExcel(req.file.buffer, parseInt(userId), parseInt(year));

    // Check user exists
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await FinancialRecordModel.deleteByUserYear(userId, year);
    await FinancialRecordModel.insertMany(records);

    res.json({ message: `Uploaded ${records.length} rows for ${user.name} (${year})` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getRecords = async (req, res) => {
  try {
    const { userId, year } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const records = await FinancialRecordModel.findByUserYear(userId, year);

    res.json({ user, year: parseInt(year), records });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};

module.exports = { uploadFile, getRecords };
