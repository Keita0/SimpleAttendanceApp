const db = require('../config/db');

exports.submitAttendance = (req, res) => {
  const userId = req.body.user_id;  // later replace with req.user.id after JWT auth
  const clock_in = new Date();
  const photo = req.file ? req.file.filename : null;

  if (!userId || !photo) {
    return res.status(400).json({ message: 'User ID and photo are required' });
  }

  db.query(
    'INSERT INTO attendance (user_id, clock_in, photo_url) VALUES (?, ?, ?)',
    [userId, clock_in, photo],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Insert failed', error: err });
      res.status(201).json({ message: 'Attendance submitted successfully' });
    }
  );
};

exports.clockOutAttendance = (req, res) => {
  const attendanceId = req.params.id; // passed via URL param
  const clockOutTime = new Date();

  db.query(
    `UPDATE attendance
     SET clock_out = ?
     WHERE id = ? AND clock_out IS NULL`,
    [clockOutTime, attendanceId],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Clock-out failed', error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Attendance not found or already clocked out' });
      }

      res.json({ message: 'Clock-out successful' });
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

exports.deleteAttendance = (req, res) => {
  const recordId = req.params.id;

  db.query('DELETE FROM attendance WHERE id = ?', [recordId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Delete failed', error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance deleted successfully' });
  });
};