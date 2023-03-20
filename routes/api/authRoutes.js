const express = require('express');
const auth = express.Router();
const authController = require('../../controllers/api/authController');
const { requireAuth } = require('../../middleware/api/authMiddleware');

auth.post('/signup', requireAuth, authController.post_signup);
auth.get('/logout', authController.get_logout);
auth.post('/login', authController.post_login);

module.exports = auth;