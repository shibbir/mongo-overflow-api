var gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    jshint = require("gulp-jshint");

gulp.task("jshint", function() {
    "use strict";

    return gulp
        .src([
            "./config/**/ *.js",
            "./routes/**/*.js",
            "./services/**/*.js",
            "./repositories/**/*.js",
            "./tests/**/*.js",
            "./*.js"
        ])
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish", { verbose: true }));
});

gulp.task("mochaTest", function () {
    "use strict";

    return gulp
        .src("./tests/**/*.js", { read: false })
        .pipe(mocha({
            reporter: "spec"
        }));
});

gulp.task("default", function() {
});