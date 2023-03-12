const Blog = require('../../models/blog');
const Comment = require('../../models/comment');


//blog_get_all, blog_get_one

const blog_get_all = (req, res) => {
    Blog.find({
        publish: true
    }).sort({ createdAt: -1 }).select({ body: 0, commentsCount: 0 })
    .then(result => {
        res.render('client/blogs', { title: 'Blogs', blogs: result, styles: 'css/home.css' });
    })
    .catch(err => {
        console.log(err);
    })
};

const blog_get_one = (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
    .then(result1 => {
        Comment.find({
            blog: id
        }).sort({ createdAt: -1 }).select({ blog: 0, email: 0, website: 0, saveCookie: 0, replyTo: 0 })
        .then(result2 => {
            if (result1) {
                res.render('client/blogPost', { title: 'Blog', blog: result1, comments: result2, styles: '../css/home.css' });
            } else {
                res.redirect('/blogs');
            }
        })
        .catch(err2 => {
            console.log(err2);
        })
    })
    .catch(err1 => {
        console.log(err1);
    })
};

module.exports = {
    blog_get_all, blog_get_one
}