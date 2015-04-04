var request   = require("supertest"),
    app       = require("../config/express")(),
    chai      = require("chai"),
    should    = chai.should(),
    faker     = require("Faker"),
    config    = require("../config/env/development"),
    mongoose  = require("mongoose"),
    passport  = require("passport"),
    testDummy = require("./testDummy");

require("../config/passport")(passport);
require("../routes/account")(app, passport);

describe("Local account routes", function() {
    "use strict";

    var newUser = null;

    before(function(done) {
        mongoose.connect(config.db.testUrl);

        testDummy.getAccessToken(function(err, user) {
            if (err) {
                throw err;
            }
            newUser = user;
            done();
        });
    });

    after(function(done) {
        testDummy.reset(function() {
            mongoose.connection.close();
            done();
        });
    });

    describe("POST /api/register", function() {

        it("should create a new local account", function(done) {
            request(app)
                .post("/api/register")
                .send({
                    name: faker.Name.findName(),
                    email: faker.Internet.email(),
                    password: "xxx-xxx"
                })
                .expect(200)
                .end(function(err) {
                    if (err) {
                        throw err;
                    }
                    done();
                });
        });

        it("should return error if email address is already registered", function(done) {
            request(app)
                .post("/api/register")
                .send({
                    name: faker.Name.findName(),
                    email: newUser.local.email,
                    password: "xxx-xxx"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property("type");
                    res.body.should.have.property("messages");
                    done();
                });
        });
    });

    describe("POST /api/token", function() {

        it("should return access token if credentials are valid", function(done) {
            request(app)
                .post("/api/token")
                .send({
                    email: newUser.local.email,
                    password: "xxx-xxx"
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property("accessToken");
                    res.body.should.have.property("expires");
                    res.body.should.have.property("issued");
                    res.body.should.have.property("user");
                    done();
                });
        });

        it("should return authorization error if credentials are invalid", function(done) {
            request(app)
                .post("/api/token")
                .send({
                    email: faker.Internet.email(),
                    password: "yyy-yyy"
                })
                .expect(401)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property("type");
                    res.body.should.have.property("messages");
                    done();
                });
        });
    });
});