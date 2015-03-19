module.exports = function(app, passport) {
    "use strict";

    app.route("/auth").get(passport.authenticate("http-bearer", { session: false }), function(req, res) {
        res.sendStatus(200);
    });
};