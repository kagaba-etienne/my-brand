const Blog = require('../models/blog');
const Comment = require('../models/comment');

//handle errors
const handleErrors = (err) => {
    
    let errors = {
        coverPhoto: '',
        title: '',
    }

    //duplicates error code
    if (err.code == 11000) {
        errors.title = 'That title is already registered';
        return errors;
    }

    //validating errors
    if (err.message.includes('Blog validation failed')){
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });
    }
    return errors;
}

// blog_delete, blog_update, blog_get_one, blog_index, blog_create, blog_comment

const blog_index = (req, res) => {
    const term = req.query.term? req.query.term : '[a-z]*';
    console.log(term);
    Blog.find({
        title: { $regex: req.query.term? req.query.term : '[a-z]*', $options:'i' }
    }).sort({ createdAt: -1 }).select({ body: 0, comments: 0, updatedAt: 0})
    .then(result => {
        res.render('admin/blogs', { title: 'Blogs', styles: '/css/admin.css', blogs: result});
    })
    .catch(err => {
        console.log(err);
    })
};

const blog_create = (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then(result => {
            res.send({ id: result._id});
        })
        .catch(err => {
            const errors = handleErrors(err);
            res.status(400).send({ errors });
        });
};

const blog_delete = (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result => {
        Comment.deleteMany({
            blog: id
        })
        .then(result => {
            res.send();
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
};

const blog_comment = async (req, res) => {
    const id = req.params.id;
    const comment = new Comment(req.body);
    let commentsCount = 1 + (await Blog.findById(id)).commentsCount;
    const update = {
        commentsCount
    }
    comment.save()
        .then(result => {
            Blog.findByIdAndUpdate(id, update, { new: true})
            .then(result1 => {
                res.send();
            })
            .catch(err1 => {
                console.log(err1);
            })
        })
        .catch(err => {
            console.log(err);
        });
};

const blog_update = (req, res) => {
    const id = req.params.id;
    const update = req.body;
    Blog.findById(id)
    .then(blog => {
        for (var key in update) {
            blog[key] = update[key];
        }
        blog.save()
        .then(result => {
            res.send({ id: result._id});
        })
        .catch(err => {
            const errors = handleErrors(err);
            res.status(400).send({ errors });
        });
    })
    .catch(err => {
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    })
};

const blog_get_one = (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.send(result);
        })
        .catch(err =>  {
            console.log(err);
        })
};

module.exports = {
    blog_index,
    blog_create,
    blog_delete,
    blog_update,
    blog_comment,
    blog_get_one
}