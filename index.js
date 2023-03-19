//configure environment variables
const dotenv = require('dotenv');
dotenv.config();

process.env.NODE_ENV = 'dev';
const config = require('config');

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');



const { requireAuth, checkUser } = require('./middleware/authMiddleware');

//routes
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/user/blogRoutes');
const contactRoutes = require('./routes/user/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

//controllers
const projectController = require('./controllers/user/projectController');
const homeController = require('./controllers/user/homeContoller');
const aboutController = require('./controllers/user/aboutController');
const skillController = require('./controllers/user/skillController');
const subscriberController = require('./controllers/user/subscriberController');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kagaba | API',
            version: '1.0.0',
            description: 'An API that allows users to obtain existing information of blogs and projects',
            termsOfService: 'https://kagaba-etienne.cyclic.app/terms-of-service',
            contact: {
                name: 'Kagaba',
                url: 'https://kagaba-etienne.cyclic.app',
                email: 'kagabaetienne365@gmail.com'
            },
            license:{
                name: 'Kagaba License',
                url: 'https://kagaba-etienne.cyclic.app'
            }
        },
        servers: [
            {
                url: 'https://kagaba-etienne.cyclic.app'
            }
        ]
    },
    apis: ['./routes/apiRoutes.js']
};
const specs = swaggerJsDoc(options);

//express app
const app = new express();

app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

//mongo db connect & start listening for requests
mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });


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
app.use(cors());
//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('dev'));
}
app.use(cookieParser());

//register view engine
app.set('view engine', 'ejs');

//auth routes
app.use(authRoutes);
app.use(apiRoutes);

//client routes
app.get('/', homeController.get_page);

app.get('/about', aboutController.get_page);

app.get('/skills', skillController.get_page);

app.get('/projects', projectController.get_all);

app.use('/contact', contactRoutes);

app.use('/blogs', blogRoutes);

app.post('/subscribers', subscriberController.subscriber_mail_save);

//admin routes
app.get('/admin*', checkUser);
app.use('/admin', requireAuth, adminRoutes);

module.exports = app; // For testing