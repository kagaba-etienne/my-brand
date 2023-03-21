const Blog = require('../models/blog');
const Project = require('../models/project');
const Query = require('../models/query');
const Subscriber = require('../models/subscriber');
const Comment = require('../models/comment');
const Log = require('../models/log');

const get_index = async (req, res) => {
    const blogs = await Blog.count();
    const comments = await Comment.count();
    const subscribers = await Subscriber.count();
    const projects = await Project.count();
    const queries = await Query.count();
    Log.find()
        .then(result => {
            res.render('admin/dashboard', {
                title: 'Dashboard',
                styles: '/css/admin.css',
                logs: result,
                blogs, comments, subscribers, queries, projects
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({ err });
        });
};

module.exports = {
    get_index
}