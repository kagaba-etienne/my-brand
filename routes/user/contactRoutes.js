const express = require('express');
const contact = express.Router();
const contactController = require('../../controllers/user/contactController');


contact.get('/', contactController.get_page);
contact.post('/', contactController.send_query);

module.exports = contact;