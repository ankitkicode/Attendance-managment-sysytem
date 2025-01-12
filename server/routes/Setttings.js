const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const authenticate = require('../middleware/authenticate');

// Admin route to set permitted location
router.post('/setPermittedLocation', authenticate.authenticateAdmin ,settingController.setPermittedLocation);
router.get('/allusers',authenticate.authenticateUser, authenticate.authenticateAdmin,  settingController.getUsers);



module.exports = router;