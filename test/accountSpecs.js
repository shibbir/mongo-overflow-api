var request  = require("supertest"),
    app      = require("../config/express")(),
    User     = require("../models/user"),
    should   = require("should"),
    config   = require("../config/env/development"),
    mongoose = require("mongoose"),
    passport = require("passport");

require("../config/passport")(passport);
require("../routes/account")(app, passport);

describe("Local account routes", function() {

    before(function(done) {
        mongoose.connect(config.db.testUrl);
        done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    describe("POST /api/register", function() {
        before(function (done) {
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
                done();
            });
        });

        after(function(done) {
            User.remove({ "local.email": "email@example.com" }, function(err) {
                if(err) {
                    throw err;
                }
                User.remove({ "local.email": "email2@example.com" }, function(err) {
                    if(err) {
                        throw err;
                    }
                    done();
                });
            });
        });

        it("should create a new local account", function(done) {
            request(app)
                .post("/api/register")
                .send({
                    name: "Test User",
                    email: "email2@example.com",
                    password: "test123"
                })
                .expect(200)
                .end(function(err) {
                    if(err) {
                        throw err;
                    }
                    done();
                });
        });

        it("should return error if email address is already registered", function(done) {
            request(app)
                .post("/api/register")
                .send({
                    name: "Test Account",
                    email: "email@example.com",
                    password: "test123"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if(err) {
                        throw err;
                    }
                    res.body.should.have.property("message");
                    done();
                });
        });
    });

    describe("POST /api/token", function() {
        before(function (done) {
            var newUser = new User();

            newUser.displayName = "Test User";
            newUser.local.email = "email@example.com";
            newUser.local.name = "Test User";
            newUser.local.password = newUser.generateHash("test123");
            newUser.save(function(err) {
                if(err) {
                    throw err;
                }
                done();
            });
        });

        after(function(done) {
            User.remove({ "local.email": "email@example.com" }, function(err) {
                if(err) {
                    throw err;
                }
                done();
            });
        });

        it("should return access token if credentials are valid", function(done) {
            request(app)
                .post("/api/token")
                .send({
                    email: "email@example.com",
                    password: "test123"
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if(err) {
                        throw err;
                    }
                    res.body.should.have.property("accessToken");
                    res.body.should.have.property("expires");
                    res.body.should.have.property("issued");
                    res.body.should.have.property("user");
                    done();
                });
        });
    });
});