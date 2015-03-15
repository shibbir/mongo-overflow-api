module.exports = function(app, passport) {
    "use strict";

    app.route("/api/register")
        .post(function(req, res, next) {
            passport.authenticate("local-signup", function (err, user, info) {
                if(err || !user) {
                    return res.status(400).json(info);
                }
                res.sendStatus(200);
            })(req, res, next);
        });
};