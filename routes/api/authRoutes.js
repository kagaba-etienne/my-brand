const express = require('express');
const auth = express.Router();
const authController = require('../../controllers/api/authController');

auth.get('/signup', authController.get_signup);
auth.post('/signup', authController.post_signup);
auth.get('/login', authController.get_login);
auth.get('/logout', authController.get_logout);
auth.post('/login', authController.post_login);

module.exports = auth;