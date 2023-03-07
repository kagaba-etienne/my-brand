const dotenv = require('dotenv');

//configure environment variables
dotenv.config();

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./modules/blog');
const Comment = require('./modules/comment');
const Query = require('./modules/query');
const Mail = require('./modules/smtpserver');
const Subscriber = require('./modules/subscriber');
const Project = require('./modules/project');
const photomap = require('./modules/photomap');


//express app
const app = new express();

//mongo db connect & start listening for requests
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        console.log('Started listening on port 3004');
        app.listen(3004);
    })
    .catch(err => console.log(err));


//helper functions
app.locals.publishText = function(publish) {
    if (publish) {
        return "Unpublish";
    }
    else {
        return "publish";
    }
};
app.locals.dateConverter = function(value) {
    numbers = value.toString().slice(4, 15).split(" ");
    mapToMonths = {
        "Jan": 'JANUARY',
        "Feb": 'FEBRUARY',
        "Mar": 'MARCH',
        "Apr": 'APRIL',
        "May": 'MAY',
        "Jun": 'JUNE',
        "Jul": 'JULY',
        "Aug": 'AUGUST',
        "Sep": 'SEPTEMBER',
        "Oct": 'OCTOBER',
        "Nov": 'NOVEMBER',
        "Dec": 'DECEMBER',
    };

    return `${mapToMonths[numbers[0]]} ${numbers[1]}, ${numbers[2]}`;
};
app.locals.manypar = function(body) {
    
};
app.locals.querySplitter = function (queries) {
    let pending = [];
    let responded = [];
    let ignored = [];

    if (queries) {
        queries.forEach(element => {
            if (element.status=="pending"){
                pending.push(element);
            } else if (element.status=="responded") {
                responded.push(element);
            }
            else {
                ignored.push(element);
            }
        })
        return { pending, responded, ignored };
    } else {
        return { pending, responded, ignored };
    }
};

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

//register view engine
app.set('view engine', 'ejs');


//client routes
app.get('/', (req, res) => {
    res.render('client/index', {
        title: 'Home',
        styles: 'css/home.css'});
});

app.get('/about', (req, res) => {
    res.render('client/about', {
        title: 'About',
        styles: 'css/home.css'});
});

app.get('/skills', (req, res) => {
    res.render('client/skills', {
        title: 'Skills',
        styles: 'css/home.css'});
});

app.get('/projects', (req, res) => {
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
});

app.get('/contact', (req, res) => {
    res.render('client/contact', {
        title: 'Contact',
        styles: 'css/home.css'});
});
app.post('/contact', (req, res) => {
    let body = req.body;
    body.photo = photomap(body.photo);
    const query = new Query(body);
    query.save()
    .then(result => {
        res.send();
    })
    .catch(err => {
        console.log(err);
    })
});

app.get('/blogs', (req, res) => {
    Blog.find({
        publish: true
    }).sort({ createdAt: -1 }).select({ body: 0, commentsCount: 0 })
    .then(result => {
        res.render('client/blogs', { title: 'Blogs', blogs: result, styles: 'css/home.css' });
    })
    .catch(err => {
        console.log(err);
    })
});
app.get('/blogs/:id', (req, res) => {
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
});

app.post('/subscribers', (req, res) => {
    const subscriber = new Subscriber(req.body);
    const email = {
        To: req.body.email,
        Subject: 'Subscribed To News Letter',
        Body: `Dear ${req.body.name.split(' ')[0]},\n\nThank you for subscribing to our newsletter. We at Kagaba are committed to providing you with useful and helpful content that is relevant to your interests. You can expect to receive updates on a regular basis and we'll do our best to make sure they are interesting and informative.\n\nWe understand that your time is valuable and we will strive to provide you with quality updates that you can benefit from. We hope that our updates will be a valuable addition to your life.\n\nWe look forward to hearing your feedback and suggestions on how we can improve our services. Please let us know if there is anything we can do to make your experience with us even better.\n\nThank you again for signing up!`
    };
    subscriber.save()
    .then(result => {
        Mail(email)
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
});


//admin routes

app.get('/admin/acc/login', (req, res) => {
    res.render('admin/acc/login', {
        title: 'Login',
        styles: '/css/signup.css'});
});
app.get('/admin/acc/signup', (req, res) => {
    res.render('admin/acc/signup', {
        title: 'Signup',
        styles: '/css/signup.css'});
});

app.get('/admin', (req, res) => {
    res.render('admin/dashboard', {
        title: 'Dashboard',
        styles: '/css/admin.css'});
});

app.get('/admin/blogs', (req, res) => {
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
});
app.post('/admin/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then(result => {
            res.send();
        })
        .catch(err => {
            console.log(err);
        });
});
app.delete('/admin/blogs/:id', (req, res) => {
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
});
app.post('/admin/blogs/:id', async (req, res) => {
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
});
app.patch('/admin/blogs/:id', (req, res) => {
    const id = req.params.id;
    const update = req.body;
    Blog.findByIdAndUpdate(id, update, { new: true})
    .then(result => {
        res.send();
    })
    .catch(err => {
        console.log(err);
    })
});
app.get('/admin/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.send(result);
        })
        .catch(err =>  {
            console.log(err);
        })
});

app.get('/admin/queries/:id', (req, res) => {
    const id = req.params.id;
    Query.findById(id)
        .then(result => {
            res.send(result);
        })
        .catch(err =>  {
            console.log(err);
        });
});
app.delete('/admin/queries/:id', (req, res) => {
    const id = req.params.id;
    Query.findByIdAndDelete(id)
    .then(result => {
        res.send();
    })
    .catch(err => {
        console.log(err);
    })
});
app.patch('/admin/queries/:id', (req, res) => {
    const id = req.params.id;
    const trash = req.body.response ? Mail(req.body.response): console.log('ignoring a query');
    const update = req.body.res;
    Query.findByIdAndUpdate(id, update, { new: true })
    .then(result => {
        res.send();
    })
    .catch(err => {
        console.log(err);
    });
});
app.get('/admin/queries', (req, res) => {
    Query.find().sort({ createdAt: -1})
        .then(result => {
            res.render('admin/queries', { title: 'Queries', queries: result, styles: '/css/admin.css'}); 
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/admin/projects', (req, res) => {
    Project.find().sort({ createdAt: -1})
        .then(result => {
            res.render('admin/projects', { title: 'Projects', projects: result, styles: '/css/admin.css'}); 
        })
        .catch(err => {
            console.log(err);
        });
});
app.post('/admin/projects', (req, res) => {
    const project = new Project(req.body);
    project.save()
        .then(result => {
            res.send();
        })
        .catch(err => {
            console.log(err);
        });
});
app.delete('/admin/projects/:id', (req, res) => {
    const id = req.params.id;
    Project.findByIdAndDelete(id)
    .then(result => {
        res.send();
    })
    .catch(err => {
        console.log(err);
    })
});
app.patch('/admin/projects/:id', (req, res) => {
    const id = req.params.id;
    const update = req.body;
    Project.findByIdAndUpdate(id, update, { new: true})
    .then(result => {
        res.send();
    })
    .catch(err => {
        console.log(err);
    })
});
app.get('/admin/projects/:id', (req, res) => {
    const id = req.params.id;
    Project.findById(id)
        .then(result => {
            res.send(result);
        })
        .catch(err =>  {
            console.log(err);
        })
});

app.get('/admin/profile', (req, res) => {
    res.render('admin/profile', {
        title: 'Profile',
        styles: '/css/admin.css'});
});

