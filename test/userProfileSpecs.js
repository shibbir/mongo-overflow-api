var request  = require("supertest"),
    app      = require("../config/express")(),
    should   = require("should"),
    config   = require("../config/env/development"),
    mongoose = require("mongoose"),
    jwt      = require("jwt-simple"),
    User     = require("../models/user"),
    moment   = require("moment"),
    passport = require("passport");

require("../config/passport")(passport);

require("../routes/user")(app, passport);

describe("User profile routes", function() {
    "use strict";

    var newUser = null,
        token;

    before(function(done) {
        mongoose.connect(config.db.testUrl);

        newUser = new User();

        newUser._id = mongoose.Types.ObjectId();
        newUser.displayName = "Test User";
        newUser.local.email = "email@example.com";
        newUser.local.name = "Test User";
        newUser.local.password = newUser.generateHash("xxx-xxx");
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
        User.remove({ "local.email": "newemail@emall.com" }, function(err) {
            if(err) {
                throw err;
            }
            mongoose.connection.close();
            done();
        });
    });

    describe("PATCH /api/users/:id/changePassword", function() {
        it("should update password", function(done) {
            request(app)
                .patch("/api/users/"+ newUser._id + "/changePassword?access_token=" + token)
                .send({
                    oldPassword: "xxx-xxx",
                    newPassword: "yyy-yyy",
                    confirmPassword: "yyy-yyy"
                })
                .expect(200)
                .end(function(err) {
                    if(err) {
                        throw err;
                    }
                    done();
                });
        });
    });

    describe("PATCH /api/users/:id", function() {
        it("should update profile information", function(done) {
            request(app)
                .patch("/api/users/"+ newUser._id + "?access_token=" + token)
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
                    if(err) {
                        throw err;
                    }
                    done();
                });
        });
    });
});