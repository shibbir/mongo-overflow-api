var request   = require("supertest"),
    app       = require("../config/express")(),
    chai      = require("chai"),
    should    = chai.should(),
    config    = require("../config/env/development"),
    mongoose  = require("mongoose"),
    faker     = require("Faker"),
    passport  = require("passport"),
    testDummy = require("./testDummy");

require("../config/passport")(passport);

require("../routes/question")(app, passport);

describe("Question routes", function() {
    "use strict";

    var newUser, accessToken, question;

    before(function(done) {
        mongoose.connect(config.db.testUrl);

        testDummy.getAccessToken(function(err, user, token) {
            if (err) {
                throw err;
            }
            newUser = user;
            accessToken = token;

            testDummy.getQuestion(newUser, function(doc) {
                question = doc;
                done();
            });
        });
    });

    after(function(done) {
        testDummy.reset(function() {
            mongoose.connection.close();
            done();
        });
    });

    describe("GET /api/questions", function() {
        it("should return paginated question collection", function(done) {
            request(app)
                .get("/api/questions")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property("data");
                    res.body.should.have.property("pagination");
                    res.body.data.length.should.not.be.above(20);
                    done();
                });
        });
    });

    describe("POST /api/questions", function() {
        it("should save a new question", function(done) {
            request(app)
                .post("/api/questions?access_token=" + accessToken)
                .send({
                    title: faker.Lorem.sentence(),
                    description: faker.Lorem.paragraphs(5),
                    creator: newUser._id
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if(err) {
                        throw err;
                    }
                    res.body.should.have.property("_id");
                    res.body.should.have.property("title");
                    res.body.should.have.property("description");
                    done();
                });
        });
    });
});