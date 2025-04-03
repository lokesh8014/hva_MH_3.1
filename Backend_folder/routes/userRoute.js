const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');

//user authenticaation routes
router.post('/users', authenticationController.createUser);//for creating user
router.get('/users', authenticationController.getUsers);//for getting created users
router.post('/users/login', authenticationController.loginUser);//for user login

module.exports = router;
