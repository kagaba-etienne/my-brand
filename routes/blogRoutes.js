const express = require('express');
const blogs = express.Router();
const blogController = require('../controllers/blogController');

blogs.get('/', blogController.blog_index);

blogs.post('/', blogController.blog_create);

blogs.delete('/:id', blogController.blog_delete);

blogs.post('/:id', blogController.blog_comment);

blogs.patch('/:id', blogController.blog_update);

blogs.get('/:id', blogController.blog_get_one);
module.exports = blogs;