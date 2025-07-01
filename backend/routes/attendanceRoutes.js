const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, upload.single('photo'), attendanceController.submitAttendance);
router.get('/', verifyToken, isAdmin, attendanceController.getAllAttendance);
router.get('/user/:id', verifyToken, attendanceController.getUserAttendance);
router.delete('/:id', verifyToken, isAdmin, attendanceController.deleteAttendance);

module.exports = router;
