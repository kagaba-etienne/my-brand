// Setting the NODE_ENV_CUSTOM variable to test
process.env.NODE_ENV_CUSTOM = 'test';

// Importing query model
const Query = require("../../models/query");
const Log = require('../../models/log');

// Importing necessary packages
const chai = require("chai")
const should = chai.should();
const chaiHttp = require("chai-http");
const app = require("../../index");

chai.use(chaiHttp);

describe("Query", () => {
    afterEach((done) => {
        Query.deleteMany({
            email: { $regex:'.*', $options:'i' }
        })
        .then(result => {
            Log.deleteMany({ action: { $regex:'.*', $options:'i' } })
                .then(result3 => {
                    done();
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        });
    });
    /**
     * Test the get all route
     */
    describe("Get all queries", () => {
        it("Should return all queries", (done) => {
            chai.request(app)
                .get('/api/queries')
                .set("jwt",`${process.env.TOKEN}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                done();
                });
        });
    });

    /**
     * Test posting a query
     */
    describe("Post querypost", () => {
        it("Should be able to post a query", (done) => {
            const querypost = {
                name: "Kagaba Etienne",
                email: "juankirkland04@gmail.com",
                phone: "+250789101112",
                message: "I have this project I am working on and would grately appreciate your help"
              };
            
            chai.request(app)
              .post('/api/contact')
              .send(querypost)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.be.eql(true);
                done();
              });
        });
    });

    /**
     * Test retrieving a querypost by ID
     */
    describe('Retrieving a query by ID', () => {
        it("Should be able to get post by ID", (done) => {
            const querypost = {
                name: "Kagaba Etienne",
                email: "juankirkland04@gmail.com",
                phone: "+250789101112",
                message: "I have this project I am working on and would grately appreciate your help",
                status: 'pending'
              };
            
            query = new Query(querypost);
            query.save()
              .then(result => {
                const id = result._id;
                chai.request(app)
                    .get('/api/queries/' + id)
                    .set("jwt",`${process.env.TOKEN}`)
                    .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('name');
                            res.body.should.have.property('email');
                            res.body.should.have.property('message');
                        done();
                    })
              })
              .catch(err => {
                console.log(err);
              })
        });
    });
    /**
     * Test deleting a query by ID
     */
    describe('Deleting a query by ID', () => {
        it("Should be able to delete a query by ID", (done) => {
            const querypost = {
                name: "Kagaba Etienne",
                email: "juankirkland04@gmail.com",
                phone: "+250789101112",
                message: "I have this project I am working on and would grately appreciate your help",
                status: "pending"
              };
            
            query = new Query(querypost);
            query.save()
              .then(result => {
                const id = result._id;
                chai.request(app)
                    .delete('/api/queries/' + id)
                    .set("jwt",`${process.env.TOKEN}`)
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
     * Test updating a query
     */
    describe("Query Updating", () => {
        it("Should be able to update a query", (done) => {
            const querypost = {
                name: "Kagaba Etienne",
                email: "juankirkland04@gmail.com",
                phone: "+250789101112",
                message: "I have this project I am working on and would grately appreciate your help",
                status: "ignored"
              };
            query = new Query(querypost);
            query.save()
                .then(result => {
                    const id = result._id;
                    const update = {
                        status: 'pending'
                      };
                    chai.request(app)
                        .patch('/api/queries/' + id)
                        .set("jwt",`${process.env.TOKEN}`)
                        .send({ res: update })
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