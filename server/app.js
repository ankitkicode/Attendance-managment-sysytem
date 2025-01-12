const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const adminRoutes = require('./routes/Setttings');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/admin', adminRoutes);

module.exports = app;