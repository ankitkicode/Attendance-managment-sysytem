const mongoose = require('mongoose');

const AdminSettingsSchema = new mongoose.Schema({
  permittedLocation: {
    permittedLatitude: { type: Number, required: true },
    permittedLongitude: { type: Number, required: true },
    radiusInMeters: { type: Number, required: true },
  },
});

module.exports = mongoose.model('AdminSettings', AdminSettingsSchema);
