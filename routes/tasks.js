const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

module.exports = router;