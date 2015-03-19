var questionService = require("../services/questionService");

module.exports = function(app, passport) {
    "use strict";

    app.route("/api/questions")
        .get(questionService.getQuestions)
        .post(passport.authenticate("http-bearer", { session: false }), questionService.postQuestion);
};