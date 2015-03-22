var async           = require("async"),
    tagRepository   = require("../repositories/tagRepository"),
    questionService = require("../services/questionService");

var getTags = function(req, res) {
    "use strict";

    var page = req.query.page ? parseInt(req.query.page) : 1,
        size = req.query.size ? parseInt(req.query.size) : 36,
        skip = page > 0 ? ((page - 1) * size) : 0,
        sort = req.query.sort || "popular";

    tagRepository.findAll(skip, size, function(err, query, count) {
        if(err) {
            return res.sendStatus(500);
        }

        if(sort === "new") {
            query.sort({ "date": -1 });
        } else if(sort === "name") {
            query.sort({ "name": 1 });
        } else if(sort === "popular") {
            query.sort({ "name": 1 });
        }

        query.populate("creator", "displayName");
        query.lean();

        query.exec(function(err, docs) {
            if(err) {
                return res.sendStatus(500);
            }

            async.each(docs, function(doc, asyncCallback) {
                questionService.getCountByQuery({ tags: doc._id }, function(err, count) {
                    if(err) {
                        return asyncCallback(err);
                    }

                    doc.questions = count || 0;
                    asyncCallback();
                });
            }, function() {
                res.status(200).json({
                    data: docs,
                    pagination: {
                        page: page,
                        pages: count / size
                    }
                });
            });
        });
    });
};

exports.getTags = getTags;