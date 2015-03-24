var tagService = require("../services/tagService");

module.exports = function(app) {
    "use strict";

    app.route("/api/tags")
        .get(tagService.getTags);
};