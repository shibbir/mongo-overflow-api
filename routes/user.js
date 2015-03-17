var jwt    = require("jwt-simple"),
    User   = require("../models/user"),
    moment = require("moment");

module.exports = function(app, passport) {
    "use strict";

    app.route("/api/register")
        .post(function(req, res, next) {
            passport.authenticate("local-signup", function(err, user, info) {
                if(err || !user) {
                    return res.status(400).json(info);
                }
                res.sendStatus(200);
            })(req, res, next);
        });

    app.route("/api/token").post(function(req, res) {
        User.findOne({ "local.email": req.body.email }).exec(function(err, user) {
            if(err) {
                return res.sendStatus(500);
            }

            if(!user || !user.validPassword(req.body.password)) {
                return res.status(401).json({ message: "Invalid credentials." });
            }

            var expires = moment().add(2, "days").valueOf();

            var token = jwt.encode({
                iss: user.id,
                exp: expires
            }, app.get("jwtTokenSecret"));

            res.status(200).json({
                access_token: token
            });
        });
    });
};