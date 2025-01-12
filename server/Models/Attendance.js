const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    location: {
      latitude: Number,
      longitude: Number,
    },
  });
  
module.exports = mongoose.model('Attendance', attendanceSchema);
  