const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  try {
    if (password !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        'UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?',
        [name, email, role, hashedPassword, id],
        (err) => {
          if (err) return res.status(500).json({ message: 'Update failed', error: err });
          res.json({ message: 'User updated successfully (with password)' });
        }
      );
    } else {
      db.query(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        [name, email, role, id],
        (err) => {
          if (err) return res.status(500).json({ message: 'Update failed', error: err });
          res.json({ message: 'User updated successfully (password unchanged)' });
        }
      );
    }
  } catch (error) {
    res.status(500).json({ message: 'Unexpected error', error });
  }
};

// Delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Delete failed', error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  });
};
