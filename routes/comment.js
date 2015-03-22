var commentService = require("../services/commentService");

module.exports = function(app, passport) {
    "use strict";

    app.route("/api/parents/:parentId/comments")
        .get(commentService.getComments)
        .post(passport.authenticate("http-bearer", { session: false }), commentService.addComment);
};