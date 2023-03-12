const express = require('express');
const projects = express.Router();
const projectController = require('../controllers/projectController');

projects.get('/', projectController.project_index);

projects.post('/', projectController.project_create);

projects.delete('/:id', projectController.project_delete);
projects.patch('/:id', projectController.project_update);
projects.get('/:id', projectController.project_get_one);

module.exports = projects;