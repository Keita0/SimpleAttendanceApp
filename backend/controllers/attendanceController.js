const db = require('../config/db');

exports.submitAttendance = (req, res) => {
  const userId = req.body.user_id;  // later replace with req.user.id after JWT auth
  const timestamp = new Date();
  const photo = req.file ? req.file.filename : null;

  if (!userId || !photo) {
    return res.status(400).json({ message: 'User ID and photo are required' });
  }

  db.query(
    'INSERT INTO attendance (user_id, timestamp, photo_url) VALUES (?, ?, ?)',
    [userId, timestamp, photo],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Insert failed', error: err });
      res.status(201).json({ message: 'Attendance submitted successfully' });
    }
  );
};

exports.getAllAttendance = (req, res) => {
  db.query('SELECT * FROM attendance', (err, results) => {
    if (err) return res.status(500).json({ message: 'Query failed' });
    res.json(results);
  });
};

exports.getUserAttendance = (req, res) => {
  const userId = req.params.id;
  db.query(
    'SELECT * FROM attendance WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Query failed' });
      res.json(results);
    }
  );
};
