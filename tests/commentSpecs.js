var request   = require("supertest"),
    app       = require("../config/express")(),
    chai      = require("chai"),
    should    = chai.should(),
    enums     = require("../config/enums"),
    faker     = require("Faker"),
    config    = require("../config/env/development"),
    mongoose  = require("mongoose"),
    passport  = require("passport"),
    testDummy = require("./testDummy");

require("../config/passport")(passport);

require("../routes/question")(app, passport);

describe("Comment Routes", function() {
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

    describe("POST /api/questions/:id/comments", function() {

        it("should add comment to a question", function(done) {
            request(app)
                .post("/api/questions/" + question._id + "/comments?access_token=" + accessToken)
                .send({
                    question: question._id,
                    area: {
                        id: question._id,
                        name: enums.area.Question
                    },
                    text: faker.Lorem.sentences(2)
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property("text");
                    res.body.should.have.property("commenter");
                    done();
                });
        });

        it("should get comments for a question", function(done) {
            request(app)
                .get("/api/questions/" + question._id + "/comments")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property("data");
                    res.body.data.length.should.not.be.above(5);
                    done();
                });
        });
    });
});