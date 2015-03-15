var api = require("../views/docs/endpoints");

module.exports = function(app) {
    "use strict";

    app.get("/", function(req, res) {
        res.render("docs/index", api);
    });
};