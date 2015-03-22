var jwt    = require("jwt-simple"),
    User   = require("../models/user"),
    moment = require("moment");

var generateToken = function(app, user) {
    "use strict";

    return jwt.encode({
        iss: user.id,
        exp: moment().add(7, "days").valueOf()
    }, app.get("jwtTokenSecret"));
};

var tokenResponse = function(app, user, provider) {
    "use strict";

    return {
        accessToken: generateToken(app, user),
        issued: moment().format("dddd, MMMM Do YYYY, h:mm:ssA Z"),
        expires: moment().add(7, "days").format("dddd, MMMM Do YYYY, h:mm:ssA Z"),
        user: {
            _id: user._id,
            name: user.displayName,
            email: user[provider].email
        }
    };
};

module.exports = function(app, passport) {
    "use strict";

    app.route("/api/register")
        .post(function(req, res, next) {
            passport.authenticate("local-signup", function(err, user, info) {
                if(err || !user) {
                    return res.status(400).json({
                        type: "ValidationError",
                        messages: [ info.message ]
                    });
                }

                res.status(200).json(tokenResponse(app, user, "local"));
            })(req, res, next);
        });

    app.route("/api/token").post(function(req, res) {
        User.findOne({ "local.email": req.body.email }).exec(function(err, user) {
            if(err) {
                return res.sendStatus(500);
            }

            if(!user || !user.validPassword(req.body.password)) {
                return res.status(401).json({
                    type: "ValidationError",
                    messages: [ "Invalid credentials." ]
                });
            }

            res.status(200).json(tokenResponse(app, user, "local"));
        });
    });

    app.route("/auth/facebook").get(passport.authenticate("facebook", { scope : "email" }));

    app.route("/auth/facebook/callback")
        .get(function(req, res, next) {
            passport.authenticate("facebook", function(err, user, info) {
                if(err || !user) {
                    return res.redirect("http://localhost:7070/#/provider=facebook&error=" + info.message);
                }

                res.redirect("http://localhost:7070/#/provider=facebook&token=" + user.facebook.token);
            })(req, res, next);
        });

    app.route("/auth/google").get(passport.authenticate("google", { scope : ["profile", "email"] }));

    app.route("/auth/google/callback")
        .get(function(req, res, next) {
            passport.authenticate("google", function(err, user, info) {
                if(err || !user) {
                    return res.redirect("http://localhost:7070/#/provider=google&error=" + info.message);
                }

                res.redirect("http://localhost:7070/#/provider=google&token=" + user.google.token);
            })(req, res, next);
        });

    app.route("/auth/github").get(passport.authenticate("github"));

    app.route("/auth/github/callback")
        .get(function(req, res, next) {
            passport.authenticate("github", function(err, user, info) {
                if(err || !user) {
                    return res.redirect("http://localhost:7070/#/provider=github&error=" + info.message);
                }

                res.redirect("http://localhost:7070/#/provider=github&token=" + user.github.token);
            })(req, res, next);
        });

    app.route("/api/oauth/user").get(function(req, res) {
        var token = req.query.token,
            query;

        if(req.query.provider === "facebook") {
            query = { "facebook.token": token };
        } else if(req.query.provider === "google") {
            query = { "google.token": token };
        }

        User.findOne(query, "displayName facebook google twitter", function(err, user) {
            if(err || !user) {
                return res.status(401).json({
                    type: "ValidationError",
                    messages: ["Invalid access token or oauth provider."]
                });
            }
            res.status(200).json(tokenResponse(app, user, req.query.provider));
        });
    });
};