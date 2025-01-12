const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/update-user-profile', authenticate.authenticateUser, userController.updateUserDetails);
router.get('/user-details', authenticate.authenticateUser, userController.getUserById);
module.exports = router;