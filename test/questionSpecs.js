var request  = require("supertest"),
    app      = require("../config/express")(),
    should   = require("should"),
    config   = require("../config/env/development"),
    mongoose = require("mongoose"),
    jwt      = require("jwt-simple"),
    User     = require("../models/user"),
    moment   = require("moment"),
    Question = require("../models/question"),
    passport = require("passport");

require("../config/passport")(passport);

require("../routes/question")(app, passport);

describe("Question Routes", function() {

    before(function(done) {
        mongoose.connect(config.db.testUrl);
        done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    describe("GET /api/questions", function() {
        it("should return questions collection with pagination data", function(done) {
            request(app)
                .get("/api/questions")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if(err) {
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
        var token;

        before(function(done) {
            var newUser = new User();

            newUser._id = mongoose.Types.ObjectId();
            newUser.displayName = "Test User";
            newUser.local.email = "email@example.com";
            newUser.local.name = "Test User";
            newUser.local.password = newUser.generateHash("test123");
            newUser.save(function(err) {
                if(err) {
                    throw err;
                }
                token = jwt.encode({
                    iss: newUser._id,
                    exp: moment().add(7, "days").valueOf()
                }, app.get("jwtTokenSecret"));

                done();
            });
        });

        after(function(done) {
            Question.remove({ title: "Test question title" }, function(err) {
                if(err) {
                    throw err;
                }
                User.remove({ "local.email": "email@example.com" }, function(err) {
                    if(err) {
                        throw err;
                    }
                    done();
                });
            });
        });

        it("should save a new question", function(done) {
            request(app)
                .post("/api/questions?access_token=" + token)
                .send({
                    title: "Test question title",
                    description: "Test question description",
                    creator: mongoose.Types.ObjectId()
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