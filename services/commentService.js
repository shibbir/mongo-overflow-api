var validator         = require("validator"),
    commentRepository = require("../repositories/commentRepository");

var addComment = function(req, res) {
    "use strict";

    var model = {
        question: req.body.question,
        parentId: req.params.parentId,
        text: validator.escape(req.body.text),
        commenter: req.user.id
    };

    commentRepository.insert(model, function(err, doc) {
        if(err) {
            return res.sendStatus(500);
        }

        doc = doc.toObject();
        doc.commenter = {
            displayName: req.user.displayName,
            avatar: req.user.avatar
        };

        res.status(200).json(doc);
    });
};

var getComments = function(req, res) {
    "use strict";

    var page = req.query.page ? parseInt(req.query.page) : 1,
        size = 5,
        skip = page > 0 ? ((page - 1) * size) : 0;

    var query = commentRepository.findAllByQuery({ parentId: req.params.parentId }, skip, size);
    query.populate("commenter", "displayName avatar");
    query.lean();

    query.exec(function(err, docs) {
        if(err) {
            return res.sendStatus(500);
        }

        res.status(200).json(docs);
    });
};

exports.addComment = addComment;
exports.getComments = getComments;