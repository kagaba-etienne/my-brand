const Project = require('../../models/project');

const get_all = (req, res) => {
    Project.find({
        publish: true
    }).sort({ createdAt: -1 })
    .then(result => {
        res.render('client/projects', {
            title: 'Projects',
            projects: result,
            styles: 'css/home.css'});
    })
    .catch(err => {
        console.log(err);
    })
};

module.exports = {
    get_all
}