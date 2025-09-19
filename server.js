require('dotenv').config();
const express = require('express');
const path = require('path');
const financeRoutes = require('./routes/financeRoutes');

const app = express();
app.use(express.json());

// API routes
app.use('/api/finances', financeRoutes);

// Serve frontend (static files)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
