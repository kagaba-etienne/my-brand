const express = require('express');
const blogs = require('./blogRoutes');
const projects = require('./projectRoutes');
const queries = require('./queryRoutes');
const dashboardController = require('../controllers/dashboardController');
const admin = express.Router();

admin.get('/', dashboardController.get_index);

//blog routes
admin.use('/blogs', blogs);

//query routes

admin.use('/queries', queries);

//project routes
admin.use('/projects', projects);


admin.get('/profile', (req, res) => {
    res.render('admin/profile', {
        title: 'Profile',
        styles: '/css/admin.css'});
});

module.exports = admin;
