// Setting the NODE_ENV variable to test
process.env.NODE_ENV = 'test';
const config = require("config");

// Importing blog model
const Blog = require("../../models/blog");
const Comment = require("../../models/comment");


// Importing necessary packages
const chai = require("chai")
const should = chai.should();
const chaiHttp = require("chai-http");
const app = require("../../index");

chai.use(chaiHttp);

console.log(process.env.TOKEN);

describe("Blog", () => {
    beforeEach((done) => {
        Blog.deleteMany({
            title: { $regex:'[a-z]*', $options:'i' }
        })
        .then(result => {
            done();
        })
        .catch(err => {
            console.log(err);
        });
    });
    /**
     * Test the get all route
     */
    describe("Get all blogposts", () => {
        it("Should return all blog posts", (done) => {
            chai.request(app)
                .get('/api/blogs')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                done();
                });
        });
    });

    /**
     * Test Post and get one route
     */

    describe("Post blogpost", () => {
        it("Should be able to post a blog", (done) => {
            const blogpost = {
                title: "A closer look at the most conventional but useless practices in delelopment",
                body: "llksajdf ldsfjalkdsfjasdf safdkjflasjdfklsa fsklfjsdlfjs dflkdsjfls fd…",
                coverPhoto: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80",
                author: "Etienne kagaba"
              };
            
            chai.request(app)
              .post('/api/blogs')
              .set("Cookie",`jwt=${process.env.TOKEN}`)
              .send(blogpost)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                done();
              });
        });
    });

    /**
     * Test retrieving a blogpost by ID
     */
    describe('Retrieving a blog by ID', () => {
        it("Should be able to get post by ID", (done) => {
            const blogpost = {
                title: "A closer look at the most conventional but useless practices in delelopment",
                body: "llksajdf ldsfjalkdsfjasdf safdkjflasjdfklsa fsklfjsdlfjs dflkdsjfls fd…",
                coverPhoto: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80",
                author: "Etienne kagaba",
                commentsCount: 0,
                shortDescr: 'flksdjflkjsdlkfjsdlf',
                publish: false
              };
            
            blog = new Blog(blogpost);
            blog.save()
              .then(result => {
                const id = result._id;
                chai.request(app)
                    .get('/api/blogs/' + id)
                    .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('title');
                            res.body.should.have.property('body');
                            res.body.should.have.property('coverPhoto');
                        done();
                    })
              })
              .catch(err => {
                console.log(err);
              })
        });
    });
    /**
     * Test deleting a blogpost by ID
     */
    describe('Deleting a blog by ID', () => {
        it("Should be able to delete post by ID", (done) => {
            const blogpost = {
                title: "A closer look at the most conventional but useless practices in delelopment",
                body: "llksajdf ldsfjalkdsfjasdf safdkjflasjdfklsa fsklfjsdlfjs dflkdsjfls fd…",
                coverPhoto: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80",
                author: "Etienne kagaba",
                commentsCount: 0,
                shortDescr: 'flksdjflkjsdlkfjsdlf',
                publish: false
              };
            
            blog = new Blog(blogpost);
            blog.save()
              .then(result => {
                const id = result._id;
                chai.request(app)
                    .delete('/api/blogs/' + id)
                    .set("Cookie",`jwt=${process.env.TOKEN}`)
                    .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('id');
                            res.body.id.should.be.eql(`${id}`);
                        done();
                    })
              })
              .catch(err => {
                console.log(err);
              })
        });
    });
    /**
     * Test commenting on a blog
     */
    describe("Blog Commenting", () => {
        it("Should be able to comment on a blog", (done) => {
            const blogpost = {
                title: "A closer look at the most conventional but useless practices in delelopment",
                body: "llksajdf ldsfjalkdsfjasdf safdkjflasjdfklsa fsklfjsdlfjs dflkdsjfls fd…",
                coverPhoto: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80",
                author: "Etienne kagaba",
                commentsCount: 0,
                shortDescr: 'flksdjflkjsdlkfjsdlf',
                publish: false
            };
            blog = new Blog(blogpost);
            blog.save()
                .then(result => {
                    const id = result._id;
                    const commentemp = {
                        name: "Kalisa Christian",
                        email: "kalisachirs@gmail.com",
                        website: "kigali.com",
                        replyTo: "blog",
                        blog: id,
                        saveCookie : false,
                        comment: "hello brother"
                    };
                    const comment = new Comment(commentemp)
                    
                    chai.request(app)
                        .post('/api/blogs/' + id)
                        .set("Cookie",`jwt=${process.env.TOKEN}`)
                        .send(comment)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('success');
                            res.body.success.should.be.eql(true);
                            done();
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        });
    });
    /**
     * Test updating a blog
     */
    describe("Blog Updating", () => {
        it("Should be able to update a blog", (done) => {
            const blogpost = {
                title: "A closer look at the most conventional but useless practices in delelopment",
                body: "llksajdf ldsfjalkdsfjasdf safdkjflasjdfklsa fsklfjsdlfjs dflkdsjfls fd…",
                coverPhoto: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80",
                author: "Etienne kagaba",
                commentsCount: 0,
                shortDescr: 'flksdjflkjsdlkfjsdlf',
                publish: false
            };
            blog = new Blog(blogpost);
            blog.save()
                .then(result => {
                    const id = result._id;
                    const update = {
                        title: "update",
                        body: "llksajdf ldsfjalkdsfjasdf safdkjflasjdfklsa fsklfjsdlfjs dflkdsjfls fd…",
                        coverPhoto: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80"
                    };
                    chai.request(app)
                        .patch('/api/blogs/' + id)
                        .set("Cookie",`jwt=${process.env.TOKEN}`)
                        .send(update)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('id');
                            res.body.id.should.be.eql(`${id}`);
                            done();
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        });
    });
});