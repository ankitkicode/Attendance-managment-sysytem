const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticate = require('../middleware/authenticate');


router.post('/check-in',authenticate.authenticateUser, attendanceController.checkIn);
router.post('/check-out', authenticate.authenticateUser, attendanceController.checkOut);
router.get('/', authenticate.authenticateUser ,authenticate.authenticateAdmin, attendanceController.getAttendanceRecords);
router.get('/get-attendance-by-userId', authenticate.authenticateUser, attendanceController.getAttendanceByuserId);

module.exports = router;