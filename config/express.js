var path       = require("path"),
    cors       = require("cors"),
    express    = require("express"),
    bodyParser = require("body-parser");

module.exports = function() {
    "use strict";

    var app = express();

    app.use(cors());

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(express.static(path.join(__dirname, "../www")));

    app.set("view engine", "jade");
    app.set("views", path.join(__dirname, "../views"));

    app.set("json spaces", 2);
    app.set("port", process.env.PORT || 7575);
    app.set("jwtTokenSecret", "a17dd903-6ffa-46d4-901a-3d34b55fce2b");

    return app;
};