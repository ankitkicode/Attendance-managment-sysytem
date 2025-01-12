const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the database already has users
    const userCount = await User.countDocuments();

    // Assign role based on user count
    const assignedRole = userCount === 0 ? 'admin' : role || 'user';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ name, email, password: hashedPassword, role: assignedRole });

    // Save the user to the database
    await user.save();

    res.json({ message: 'User registered successfully', role: assignedRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
  res.json({ token , user:{
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }});
};
exports.getUserById = async (req, res) => {
  const userId = req.params.id || req.user.id;

  const user = await User.findById(userId).select('-password');

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user);

}

exports.updateUserDetails = async (req, res) => {
  const userId = req.user.id;
  const { name, email } = req.body;
  if(!name || !email) return res.status(400).json({ message: 'Name and email are required' });
  const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User details updated successfully', user });
}
