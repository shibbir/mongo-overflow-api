var questionService = require("../services/questionService");

module.exports = function(app) {
    "use strict";

    app.route("/api/questions")
        .get(questionService.getQuestions);
};