const Blog = require('../../models/blog');
const Comment = require('../../models/comment');
const photomap = require('../../models/photomap');
const Log = require('../../models/log');

//Getting short descriptions
const getShort = function (body) {
    if (body.length > 203) {
        return `${body.slice(0, 202)} ...`;
    }
    else {
        return body;
    }
}

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
        Object.values(err.errors).forEach((properties) => {
            errors[properties.path] = properties.message
        });
    }
    return errors;
}

// blog_delete, blog_update, blog_get_one, blog_index, blog_create, blog_comment

const blog_index = (req, res) => {
    const term = req.query.term? req.query.term : '.*';
    Blog.find({
        title: { $regex: term, $options:'i' }
    }).sort({ createdAt: -1 }).select({ updatedAt: 0 })
    .then(result => {
        res.status(200).send(result);
    })
    .catch(err => {
        console.log(err);
        res.status(400).send();
    })
};

const blog_create = (req, res) => {
    req.body.shortDescr = getShort(req.body.body);
    req.body.body = req.body.body.split('\n[COVER]\n');
    req.body.publish = false;
    req.body.commentsCount = 0;
    const blog = new Blog(req.body);
    blog.save()
        .then(result => {
            const logBody = {
                action: "You created this blogpost title",
                subject: result.title
            }
            const log = new Log(logBody);
            log.save()
                .then(result1 => {
                    res.send({ id: result._id});
                })
                .catch(err1 => {
                    res.status(500).send({ message: "Encountered server error" } );
                });
        })
        .catch(err => {
            console.log(err);
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
        .then(result1 => {
            const logBody = {
                action: "You deleted this blogpost title",
                subject: result.title
            }
            const log = new Log(logBody);
            log.save()
                .then(result2 => {
                    res.status(200).send({ id: result._id });
                })
                .catch(err2 => {
                    res.status(500).send({ message: "Encountered server error" } );
                });
        })
        .catch(err1 => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
};

const blog_comment = async (req, res) => {
    const id = req.params.id;
    req.body.photo = photomap(req.body.name[0]);
    const comment = new Comment(req.body);
    let commentsCount = 1 + (await Blog.findById(id)).commentsCount;
    const update = {
        commentsCount
    }
    comment.save()
        .then(result => {
            Blog.findByIdAndUpdate(id, update, { new: true})
            .then(result1 => {
                const logBody = {
                    action: "New comment on this blogpost title",
                    subject: result1.title
                }
                const log = new Log(logBody);
                log.save()
                    .then(result2 => {
                        res.status(200).send({ success: true });
                    })
                    .catch(err2 => {
                        res.status(500).send({ message: "Encountered server error" } );
                    });
            })
            .catch(err1 => {
                console.log(err1);
                res.status(400).send({ success: false });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({ success: false });
        });
};

const blog_update = (req, res) => {
    const id = req.params.id;
    req.body.body? req.body.body = req.body.body.split('\n[COVER]\n') : {};
    req.body.shortDescr? req.body.shortDescr = getShort(req.body.body) : {};
    const update = req.body;
    Blog.findById(id)
    .then(blog => {
        for (var key in update) {
            blog[key] = update[key];
        }
        blog.save()
        .then(result => {
            const logBody = {
                action: "You updated this blogpost title",
                subject: result.title
            }
            const log = new Log(logBody);
            log.save()
                .then(result1 => {
                    res.status(200).send({ id: result._id});
                })
                .catch(err1 => {
                    res.status(500).send({ message: "Encountered server error" } );
                });
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
            res.status(200).send(result);
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