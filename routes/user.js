var userService = require("../services/userService");

module.exports = function(app, passport) {
    "use strict";

    app.route("/api/users/changePassword")
        .patch(passport.authenticate("http-bearer", { session: false }), userService.changePassword);

    app.route("/api/users/changeAvatar")
        .patch(passport.authenticate("http-bearer", { session: false }), userService.changeAvatar);

    app.route("/api/users/:id")
        .get(userService.getUser)
        .patch(passport.authenticate("http-bearer", { session: false }), userService.updateInfo);

    app.route("/api/users/:id/views")
        .patch(passport.authenticate("http-bearer", { session: false }), userService.addViewer);
};