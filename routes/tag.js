var tagService = require("../services/tagService");

module.exports = function(app, passport) {
    "use strict";

    app.route("/api/tags")
        .get(tagService.getTags)
        .post(passport.authenticate("http-bearer", { session: false }), tagService.getTags);
};