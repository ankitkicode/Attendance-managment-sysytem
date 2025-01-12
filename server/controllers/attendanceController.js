const Attendance = require('../models/Attendance');
const AdminSettings = require('../Models/Settings');

const geolib = require('geolib'); // Make sure to include geolib for distance calculations

exports.checkIn = async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch the permitted location from the database
    const adminSettings = await AdminSettings.findOne();
    if (!adminSettings || !adminSettings.permittedLocation) {
      return res.status(400).json({ message: 'Permitted location not set by admin' });
    }
    const { permittedLatitude, permittedLongitude, radiusInMeters } = adminSettings.permittedLocation;
    // Check if the user has already checked in today
    const existingCheckIn = await Attendance.findOne({
      userId: req.user.id,
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingCheckIn) {
      return res.status(400).json({ message: 'You have already checked in today' });
    }

    // Validate the user's location within the permitted radius
    const isWithinAllowedArea = geolib.isPointWithinRadius(
      { latitude, longitude },
      { latitude: permittedLatitude, longitude: permittedLongitude },
      radiusInMeters || 100 // Default to 100 meters if radius is not set
    );

    if (!isWithinAllowedArea) {
      return res.status(403).json({ message: 'You are not within the permitted location radius (100 meters)' });
    }

    // Create a new check-in record
    const attendance = new Attendance({
      userId: req.user.id,
      checkInTime: new Date(),
      location: { latitude, longitude },
    });

    await attendance.save();
    res.json({ message: 'Check-in successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.checkOut = async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find today's check-in record for the user
    const attendance = await Attendance.findOne({
      userId: req.user.id,
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
      checkOutTime: null, // Ensure the user has not already checked out
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No active check-in found for today' });
    }

    // Fetch the permitted location from the database
    const adminSettings = await AdminSettings.findOne();
    if (!adminSettings || !adminSettings.permittedLocation) {
      return res.status(400).json({ message: 'Permitted location not set by admin' });
    }

    const { permittedLatitude, permittedLongitude, radiusInMeters } = adminSettings.permittedLocation;

    // Validate the user's location within the permitted radius for check-out
    const isWithinAllowedArea = geolib.isPointWithinRadius(
      { latitude, longitude },
      { latitude: permittedLatitude, longitude: permittedLongitude },
      radiusInMeters || 100 // Default to 100 meters if radius is not set
    );

    if (!isWithinAllowedArea) {
      return res.status(403).json({ message: 'You are not within the permitted location radius (100 meters)' });
    }

    // Update the checkout time
    attendance.checkOutTime = new Date();
    await attendance.save();

    res.json({ message: 'Check-out successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAttendanceByuserId = async (req, res) => {
try {
    const attendance = await Attendance.find({ userId: req.user.id });
    res.json(attendance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAttendanceRecordesByStartEndDate = async (req, res) => {
  try {
    // Get the start and end date from the request body
    const { startDate, endDate } = req.body;

    // Parse the dates to ensure they are Date objects
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // Check if the dates are valid
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Fetch attendance records based on user ID and the provided date range
    const attendance = await Attendance.find({
      userId: req.user.id,
      checkInTime: { $gte: parsedStartDate, $lte: parsedEndDate },
    });

    // Return the attendance records as the response
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAttendanceRecords = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const attendanceRecords = await Attendance.find().populate('userId', 'name email');
  res.json(attendanceRecords);
};
