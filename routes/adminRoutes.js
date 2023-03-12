const express = require('express');
const blogs = require('./blogRoutes');
const projects = require('./projectRoutes');
const queries = require('./queryRoutes');
const admin = express.Router();

admin.get('/', (req, res) => {
    res.render('admin/dashboard', {
        title: 'Dashboard',
        styles: '/css/admin.css'});
});

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
