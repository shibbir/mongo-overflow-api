var questionService = require("../services/questionService");

module.exports = function(app, passport) {
    "use strict";

    app.route("/api/questions")
        .get(questionService.getQuestions)
        .post(passport.authenticate("http-bearer", { session: false }), questionService.postQuestion);

    app.route("/api/questions/:id")
        .get(questionService.getQuestion);

    app.route("/api/questions/:id/upVote")
        .patch(passport.authenticate("http-bearer", { session: false }), questionService.upVote);

    app.route("/api/questions/:id/downVote")
        .patch(passport.authenticate("http-bearer", { session: false }), questionService.downVote);

    app.route("/api/questions/:id/favorite")
        .patch(passport.authenticate("http-bearer", { session: false }), questionService.pushFavorite)
        .delete(passport.authenticate("http-bearer", { session: false }), questionService.pullFavorite);
};