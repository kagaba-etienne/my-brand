// Setting the NODE_ENV_CUSTOM variable to test
process.env.NODE_ENV_CUSTOM = 'test';

// Importing subscriber model
const Subscriber = require("../../models/subscriber");


// Importing necessary packages
const chai = require("chai")
const should = chai.should();
const chaiHttp = require("chai-http");
const app = require("../../index");

chai.use(chaiHttp);

describe("Subscriber", () => {
    afterEach((done) => {
        Subscriber.deleteMany({
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
     * Test posting a subscriber
     */
    describe("Post subscriber", () => {
        it("Should be able to enlist a subscriber", (done) => {
            const subscriberpost = {
                "name": "Dwayne Campbell",
                "email": "juankirkland04@gmail.com"
              };
            
            chai.request(app)
              .post('/api/subscriber')
              .send(subscriberpost)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.be.eql('Successfully subscribed on our news letter');
                done();
              });
        });
    });
});