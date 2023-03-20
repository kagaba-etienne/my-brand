// Setting the NODE_ENV_CUSTOM variable to test
process.env.NODE_ENV_CUSTOM = 'test';

// Importing user model
const User = require("../../models/user");


// Importing necessary packages
const chai = require("chai")
const should = chai.should();
const chaiHttp = require("chai-http");
const app = require("../../index");

chai.use(chaiHttp);

describe("User", () => {
    afterEach((done) => {
        User.deleteMany({
            email: { $regex:'.*', $options:'i' }
        })
        .then(result => {
            done();
        })
        .catch(err => {
            console.log(err);
        });
    });

    /**
     * Test posting a user
     */
    describe("Post user", () => {
        it("Should be able to sign up a user", (done) => {
            const userpost = {
                "name": "Dwayne Campbell",
                "email": "juankirkland04@gmail.com",
                "password": "T3st!234"
              };
            
            chai.request(app)
              .post('/api/user/signup')
              .set("Cookie",`jwt=${process.env.TOKEN}`)
              .send(userpost)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user');
                    res.body.should.have.property('token');
                done();
              });
        });
        it("Should be able to login a user", (done) => {
            const userpost = {
                "name": "Dwayne Campbell",
                "email": "juankirkland04@gmail.com",
                "password": "T3st!234"
              };
            const user = new User(userpost);

            user.save()
            .then(result => {
                const credentials = {
                    "email": "juankirkland04@gmail.com",
                    "password": "T3st!234"
                  };
                chai.request(app)
                .post('/api/user/login')
                .send(credentials)
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('user');
                        res.body.should.have.property('token');
                    done();
                });
            });
        });
    });
    /**
     * Test logging out a user
     */
    describe("Logout a user", () => {
        it("Should be able to logout a user", (done) => {
            chai.request(app)
              .get('/api/user/logout')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.be.eql('Successfully Logged out');
                done();
              });
        });
    });
});