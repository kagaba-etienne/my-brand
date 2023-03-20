const express = require('express');
const auth = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/api/authMiddleware');

auth.get('/signup', requireAuth, authController.get_signup);
auth.post('/signup', requireAuth, authController.post_signup);
auth.get('/login', authController.get_login);
auth.post('/login', authController.post_login);
auth.get('/logout', authController.get_logout);

module.exports = auth;