var request   = require("supertest"),
    app       = require("../config/express")(),
    chai      = require("chai"),
    should    = chai.should(),
    config    = require("../config/env/development"),
    mongoose  = require("mongoose"),
    passport  = require("passport"),
    testDummy = require("./testDummy");

require("../config/passport")(passport);
require("../routes/user")(app, passport);

describe("User profile routes", function() {
    "use strict";

    var newUser, accessToken;

    before(function(done) {
        mongoose.connect(config.db.testUrl);

        testDummy.getAccessToken(function(err, user, token) {
            if (err) {
                throw err;
            }
            newUser = user;
            accessToken = token;

            done();
        });
    });

    after(function(done) {
        testDummy.reset(function() {
            mongoose.connection.close();
            done();
        });
    });

    describe("PATCH /api/users/:id/changePassword", function() {
        it("should update password", function(done) {
            request(app)
                .patch("/api/users/"+ newUser._id + "/changePassword?access_token=" + accessToken)
                .send({
                    oldPassword: "xxx-xxx",
                    newPassword: "yyy-yyy",
                    confirmPassword: "yyy-yyy"
                })
                .expect(200)
                .end(function(err) {
                    if (err) {
                        throw err;
                    }
                    done();
                });
        });
    });

    describe("PATCH /api/users/:id", function() {
        it("should update profile information", function(done) {
            request(app)
                .patch("/api/users/"+ newUser._id + "?access_token=" + accessToken)
                .send({
                    bio: "My Bio",
                    website: "http://example.com",
                    location: "Mars",
                    displayName: "My Display Name",
                    name: "My Local Name",
                    email: "newemail@emall.com"
                })
                .expect(200)
                .end(function(err) {
                    if (err) {
                        throw err;
                    }
                    done();
                });
        });
    });
});