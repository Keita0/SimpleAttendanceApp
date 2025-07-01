const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// show image on front end
// gave full path to backend folder
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.get('/', (req, res) => {
  res.send('API is running');
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api/attendance', attendanceRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


module.exports = app;