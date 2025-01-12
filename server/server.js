const app = require('./app');
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/attendanceDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
        console.log('Connected to MongoDB');
        }
    ).
    catch((error) => {
        console.log('Error:', error);
        }
    );

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
