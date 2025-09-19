const express = require('express');
const { uploadFile, getRecords } = require('../controllers/financeController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload/:userId/:year', upload.single('file'), uploadFile);
router.get('/:userId/:year', getRecords);

module.exports = router;
