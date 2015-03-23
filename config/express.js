var fs         = require("fs"),
    path       = require("path"),
    cors       = require("cors"),
    multer     = require("multer"),
    express    = require("express"),
    passport   = require("passport"),
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
    app.use(express.static(path.join(__dirname, "../www/uploads")));

    app.use(passport.initialize());

    app.set("view engine", "jade");
    app.set("views", path.join(__dirname, "../views"));

    app.set("json spaces", 2);
    app.set("port", process.env.PORT || 7575);
    app.set("jwtTokenSecret", "a17dd903-6ffa-46d4-901a-3d34b55fce2b");

    app.use(multer({
        dest: "./www/uploads/",
        limits: {
            fileSize: 1024 * 1024 * 100
        },
        onFileSizeLimit: function(file) {
            fs.unlinkSync("./" + file.path);
        }
    }));

    return app;
};