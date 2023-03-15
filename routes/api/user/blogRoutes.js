const express = require('express');
const blog = express.Router();
const blogController = require('../../../controllers/api/user/blogController');

blog.get('/', blogController.blog_get_all);
blog.get('/:id', blogController.blog_get_one);

module.exports = blog;