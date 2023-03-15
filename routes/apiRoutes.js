const api = require('express').Router();


/**
 * @swagger
 * tags:
 *   - name: Blog
 *     description: Blog Post managing API
 *   - name: Project
 *     description: Project managing API
 *   - name: Query
 *     description: Query managing API
 *   - name: Subscriber
 *     description: Subscriber managing API
 *   - name: User
 *     description: User managing API
 *   - name: Admin
 *     description: Avaible operation for Admin
 *   - name: Client
 *     description: Available operations for client
 * 
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: cookie
 *       name: jwt
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: Dwayne Campbell
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: juankirkland04@gmail.com
 *         password:
 *           type: string
 *           description: The password of the account
 *           example: T3st!234
 *     Comment:
 *       type: object
 *       required:
 *         - blog
 *         - name
 *         - email
 *         - comment
 *         - saveCookie
 *         - replyTo
 *       properties:
 *         blog:
 *           type: string
 *           description: An id of a blog this comment belongs
 *           example: 640f2eccc0af2546d4a65fb1
 *         name:
 *           type: string
 *           description: The name of the person commenting
 *           example: Dwayne Campbell
 *         email:
 *           type: string
 *           description: The email of person commenting
 *           example: juankirkland04@gmail.com
 *         comment:
 *           type: string
 *           description: the actual comment being added to a blog
 *           example: This is a really nice blog man, keep it up
 *         saveCookie:
 *           type: boolean
 *           description: The permission to store name and email in browser, so that user won't have to enter the same details again to save time
 *           example: true
 *         replyTo:
 *           type: string
 *           description: The instance you are commenting on either 'blog'/## default or ${id} of the instance you are replying to.
 *     Subscriber:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The email to receive updates
 *           example: juankirkland04@gmail.com
 *         name:
 *           type: string
 *           description: The name of subscriber
 *           example: Dwayne Campbell
 *     Query:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           description: The name of a person sending a query
 *           example: Kagaba Etienne
 *         email:
 *           type: string
 *           description: the email you wish to be responed on
 *           example: juankirkland04@gmail.com
 *         phone:
 *           type: string
 *           description: A phone to reach you if applicable
 *           example: '+250789101112'
 *         message:
 *            type: string
 *            description: The message you wish to send
 *            example: I have this project I am working on and would grately appreciate your help
 *     Project:
 *       type: object
 *       required:
 *         - title
 *         - body
 *         - coverPhoto
 *         - author
 *       properties:
 *         _id:
 *           type: object
 *           description: The auto generated id of the project
 *           example: 640f2eccc0af2546d4a65fb1
 *         title:
 *           type: string
 *           description: The project title
 *           example: A contribution made to spotify
 *         body:
 *           oneOf:
 *             - type: string
 *             - type: array
 *           description: The paragraphs of the body
 *           example: llksajdf ldsfjalkdsfjasdf safdkjflasjdfklsa fsklfjsdlfjs dflkdsjfls fd…
 *         coverPhoto:
 *           type: string
 *           description: Cover photo link
 *           example: https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - body
 *         - coverPhoto
 *         - author
 *       properties:
 *         _id:
 *           type: object
 *           description: The auto generated id of the blog post
 *           example: 640f2eccc0af2546d4a65fb1
 *         title:
 *           type: string
 *           description: The blog post title
 *           example: A closer look at the most conventional but useless practices in delelopment
 *         body:
 *           oneOf:
 *             - type: string
 *             - type: array
 *           description: The body paragraphs
 *           example: llksajdf ldsfjalkdsfjasdf safdkjflasjdfklsa fsklfjsdlfjs dflkdsjfls fd…
 *         coverPhoto:
 *           type: string
 *           description: Cover photo link
 *           example: https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80
 *         author:
 *           type: string
 *           description: The blog post author
 *           example: Etienne kagaba
 *     Error-blog:
 *       type: object
 *       properties:
 *         coverPhoto:
 *           type: string
 *           example: Please enter a valid link
 *         title:
 *           type: string
 *           example: Please enter a blogpost title
 *         body:
 *           type: string
 *           example: Please enter a blogpost body
 *     Error-registration:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: Please enter a valid email address
 *         password:
 *           type: string
 *           example: Please enter a correct password
 *         confirm password:
 *           type: string
 *           example: Passwords do not match
 *   responses:
 *     UnauthorizedError:
 *       description: Error user not authorized \# Access token is missing or invalid \#
 * 
 * paths:
 *   /api/blogs/{id}:
 *     get:
 *       description: Obtain information about specific blogpost from database
 *       tags:
 *         - Blog
 *         - Admin
 *         - Client
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The id of blogpost to be returned
 *           schema:
 *             type: string
 *             example: 640f2eccc0af2546d4a65fb1
 *         
 *       responses:
 *         200:
 *           description: Successfull pull of blogpost info
 *           content:
 *             aplication/json:
 *               schema:
 *                 $ref: '#/components/schemas/Blog'
 *     
 *     delete:
 *       security:
 *         - ApiKeyAuth: []
 *       description: Delete specific blogpost from database
 *       tags:
 *         - Blog
 *         - Admin
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The id of blogpost to be deleted
 *           schema:
 *             type: string
 *             example: 640f2eccc0af2546d4a65fb1
 * 
 *       responses:
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         
 *         200:
 *           description: Successfully deleted a blogpost
 *     
 *     patch:
 *       security:
 *         - ApiKeyAuth: []
 *       description: Delete specific blogpost from database
 *       tags:
 *         - Blog
 *         - Admin
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The id of blogpost to be deleted
 *           schema:
 *             type: string
 *             example: 640f2eccc0af2546d4a65fb1
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Blog'
 * 
 *       responses:
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         
 *         200:
 *           description: Successfully patched a blogpost
 *         
 *         400:
 *           description: Blogpost patch was not successful
 *           content:
 *             aplication/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error-blog'
 *     
 *     post:
 *       description: Comment on a specific blogpost
 *       tags:
 *         - Client
 *         - Blog
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The id of a blogpost to add a comment to
 *           schema:
 *             type: string
 *             example: 640f2eccc0af2546d4a65fb1
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       responses:
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         
 *         200:
 *           description: Successfully commented on a blogpost
 *         
 *         400:
 *           description: Commenting was not successful
 *           content:
 *             aplication/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error-blog'
 * 
 *   /api/blogs:
 *     get:
 *       description: Obtain information about all blogpost from database
 *       tags:
 *         - Blog
 *         - Admin
 *         - Client
 *       parameters:
 *         - in: query
 *           name: term
 *           description: The term to search \### it searches in titles only
 *           required: false
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: A close look
 *       responses:
 *         200:
 *           description: Successfull pull of blogposts from the database
 *           content:
 *             aplication/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Blog'
 *     post:
 *       security:
 *           - ApiKeyAuth: []
 *       description: Creates a new blogpost in the database and returns its id
 *       tags:
 *         - Blog
 *         - Admin
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       responses:
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         
 *         200:
 *           description: Successfully created blogpost in the database
 *           content:
 *             aplication/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 640f2eccc0af2546d4a65fb1
 *         
 *         400:
 *           description: Blogpost creation was not successful
 *           content:
 *             aplication/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error-blog'
 *   
 *   /api/projects/{id}:
 *     get:
 *       description: Obtain information about specific project from database
 *       tags:
 *         - Project
 *         - Admin
 *         - Client
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The id of project to be returned
 *           schema:
 *             type: string
 *             example: 640f2eccc0af2546d4a65fb1
 *         
 *       responses:
 *         200:
 *           description: Successfull pull of project info
 *           content:
 *             aplication/json:
 *               schema:
 *                 $ref: '#/components/schemas/Project'
 *     
 *     delete:
 *       security:
 *         - ApiKeyAuth: []
 *       description: Delete specific project from database
 *       tags:
 *         - Project
 *         - Admin
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The id of project to be deleted
 *           schema:
 *             type: string
 *             example: 640f2eccc0af2546d4a65fb1
 * 
 *       responses:
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         
 *         200:
 *           description: Successfully deleted a project
 *     
 *     patch:
 *       security:
 *         - ApiKeyAuth: []
 *       description: Delete specific project from database
 *       tags:
 *         - Project
 *         - Admin
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The id of project to be deleted
 *           schema:
 *             type: string
 *             example: 640f2eccc0af2546d4a65fb1
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Project'
 * 
 *       responses:
 *         200:
 *           description: Successfully patched a project
 *         
 *         400:
 *           description: Project patch was not successful
 *           content:
 *             aplication/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error-blog'
 * 
 *   /api/projects:
 *     get:
 *       description: Obtain information about all projects from database
 *       tags:
 *         - Project
 *         - Admin
 *         - Client
 *       responses:
 *         200:
 *           description: Successfull pull of projects from the database
 *           content:
 *             aplication/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Project'
 *     post:
 *       security:
 *         - ApiKeyAuth: []
 *       description: Creates a new project in the database and returns its id
 *       tags:
 *         - Project
 *         - Admin
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       responses:
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         
 *         200:
 *           description: Successfully created project in the database
 *           content:
 *             aplication/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 640f2eccc0af2546d4a65fb1
 *         
 *         400:
 *           description: Project creation was not successful
 *           content:
 *             aplication/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error-blog'
 *   
 *   /api/contact:
 *     post:
 *       description: Sends a query to the admin
 *       tags:
 *         - Admin
 *         - Query
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Query'
 *       responses:
 *         200:
 *           description: Successfully send query to the admin
 *           content:
 *             aplication/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   sucess:
 *                     type: boolean
 *                     example: true
 *   
 *   /api/subscriber:
 *     post:
 *       description: Subscribe to the newletter
 *       tags:
 *         - Subscriber
 *         - Admin
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscriber'
 *       responses:
 *         200:
 *           description: Successfully subscribed to our news letter
 *           content:
 *             aplication/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 640f2eccc0af2546d4a65fb1
 *         400:
 *           description: Subscription was not successful
 *           content:
 *             aplication/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error-registration'
 *   
 *   /api/user/login:
 *     post:
 *       description: Login a user
 *       tags:
 *         - User
 *         - Admin
 *         - Client
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *         200:
 *           description: Successfully logged in a user
 *         
 *         400:
 *           description: Login was not successful
 *           content:
 *             aplication/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error-registration'
 *   
 *   /api/user/signup:
 *     post:
 *       security:
 *         - ApiKeyAuth: []
 *       description: Signup a user
 *       tags:
 *         - Admin
 *         - User
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         
 *         200:
 *           description: Successfully signed up a user
 *         400:
 *           description: Signup was not successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error-registration'
 *   /api/user/logout:
 *     get:
 *       description: Logout a current loggedin user
 *       tags:
 *         - Admin
 *         - User
 *       responses:
 *         200:
 *           description: Successfully logged out
 *   
 *   /api/queries:
 *     get:
 *       security:
 *         - ApiKeyAuth: []
 *       description: Obtain information of all queries in the database
 *       tags:
 *         - Admin
 *         - Query
 *       responses:
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         
 *         200:
 *           description: Successfull pulled all queries from the database
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Query'
 *   
 *   /api/queries/{id}:
 *     get:
 *       security:
 *         - ApiKeyAuth: []
 *       description: Obtain information about specific query
 *       tags:
 *         - Query
 *         - Admin
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The id of the query requested
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: 640f2eccc0af2546d4a65fb1
 *       responses:
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         
 *         200:
 *           description: Successfully pulled a query out of the database
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Query'
 *         400:
 *           description: A query with that id was not found
 *   
 *     patch:
 *       security:
 *         - ApiKeyAuth: []
 *       description: Update information of a specific query
 *       tags:
 *         - Query
 *         - Admin
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The id of the query to patch
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: 640f2eccc0af2546d4a65fb1
 *       requestBody:
 *         required: true
 *         content:
 *           appllication/json:
 *             schema:
 *               $ref: '#/components/schemas/Query'
 *       responses:
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         
 *         200:
 *           description: Successfully patched a query
 *         
 *         400:
 *           description: Query patching was not successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error-registration'
 *   
 *     delete:
 *       security:
 *         - ApiKeyAuth: []
 *       description: Delete information of a specific query
 *       tags:
 *         - Query
 *         - Admin
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The id of the query to be deleted
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: 640f2eccc0af2546d4a65fb1
 *       responses:
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         
 *         200:
 *           description: Successfully deleted a query
 *         
 *         404:
 *           description: A query with that id was not found
 */

//controllers
const projectController = require('../controllers/api/user/projectController');
const subscriberController = require('../controllers/api/user/subscriberController');

//routes
const adminRoutes = require('./api/adminRoutes');
// const blogRoutes = require('./api/user/blogRoutes');
const contactRoutes = require('./api/user/contactRoutes');
const authRoutes = require('./api/authRoutes');

//auth routes
api.use('/api/user', authRoutes);

//client routes
api.get('/api/projects', projectController.get_all);

api.use('/api/contact', contactRoutes);

// api.use('/api/blogs', blogRoutes);

api.post('/api/subscriber', subscriberController.subscriber_mail_save);

//admin routes
api.use('/api', adminRoutes);

module.exports = api;