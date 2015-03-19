var Tag                = require("../models/tag"),
    _                  = require("lodash"),
    Question           = require("../models/question"),
    validator          = require("validator"),
    User               = require("../models/user"),
    questionRepository = require("../repositories/questionRepository");

var formatQuestion = function(question) {
    "use strict";

    var description = question.description.substr(0, 200);

    if(question.description.length > description.length) {
        description += "...";
    }

    question.description = description;

    return question;
};

var getQuestions = function(req, res) {
    "use strict";

    var page = req.query.page ? parseInt(req.query.page) : 1,
        size = req.query.size ? parseInt(req.query.size) : 20,
        skip = page > 0 ? ((page - 1) * size) : 0,
        sort = req.query.sort || "new";

    questionRepository.findAll(skip, size, function(err, query, count) {
        if(err) {
            return res.sendStatus(500);
        }

        if(sort === "new") {
            query.sort({ "date": -1 });
        }

        query.select("creator title answers views tags description");
        query.populate("tags", "name");
        query.populate("creator", "displayName reputations");
        query.lean();

        query.exec(function(err, docs) {
            if(err) {
                return res.sendStatus(500);
            }

            _.forEach(docs, function(doc) {
                doc = formatQuestion(doc);
            });

            res.status(200).json({
                pagination: {
                    page: page,
                    pages: count / size
                },
                data: docs
            });
        });
    });
};

var postQuestion = function(req, res) {
    "use strict";

    var model = {
        title: validator.escape(req.body.title),
        description: validator.escape(req.body.description),
        creator: req.user.id
    };

    questionRepository.insert(model, function(err, doc) {
        if(err) {
            return res.status(500).json(err);
        }
        res.status(200).json(doc);
    });
};

exports.getQuestions = getQuestions;
exports.postQuestion = postQuestion;