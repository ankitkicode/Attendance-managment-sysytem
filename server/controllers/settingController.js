const AdminSettings = require('../Models/Settings');

const geolib = require('geolib'); 
const User = require('../Models/User');

exports.setPermittedLocation = async (req, res) => {
  const { latitude, longitude, radiusInMeters=50 } = req.body;

  console.log(latitude, longitude, radiusInMeters);
  try {
    // Validate inputs
    if (!latitude || !longitude || !radiusInMeters) {
      return res.status(400).json({ message: 'Invalid location data' });
    }

    // Update or create the permitted location
    const adminSettings = await AdminSettings.findOneAndUpdate(
      {},
      { permittedLocation: { permittedLatitude: latitude, permittedLongitude: longitude, radiusInMeters } },
      { upsert: true, new: true }
    );

    res.json({ message: 'Permitted location updated successfully', adminSettings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getUsers = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const users = await User.find().select('-password');
  res.json(users);
};
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  if (req.user.id === userId) return res.status(403).json({ message: 'You cannot delete your own account' });
  const user = await User.findByIdAndDelete(userId);
  if(!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted successfully', user });
}
exports.deleteAllUsers = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  await User.deleteMany();
  res.json({ message: 'All users deleted successfully' });
};
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email,} = req.body;
  if(!name || !email) return res.status(400).json({ message: 'All fields are required' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;

  await user.save();
  res.json({ message: 'User updated successfully' });
};