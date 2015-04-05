var Tag                = require("../models/tag"),
    _                  = require("lodash"),
    User               = require("../models/user"),
    enums              = require("../config/enums"),
    Question           = require("../models/question"),
    validator          = require("validator"),
    utilityService     = require("../services/utilityService"),
    commentRepository  = require("../repositories/commentRepository");

var formatComment = function(req, comment) {
    "use strict";

    if(comment.commenter.avatar) {
        comment.commenter.avatar.absolutePath = utilityService.getPublicUploadPath(req) + comment.commenter.avatar.fileName;
    }

    return comment;
};

var addComment = function(req, callback) {
    "use strict";

    var model = {
        question: req.body.question,
        area: req.body.area,
        text: validator.escape(req.body.text),
        commenter: req.user.id
    };

    /** check if the question id is valid */

    commentRepository.insert(model, function(err, doc) {
        if(err) {
            return callback(err);
        }

        doc.commenter = _.pick(req.user, [ "displayName", "avatar" ]);

        callback(null, formatComment(req, doc.toObject()));
    });
};

var getComments = function(req, callback) {
    "use strict";

    var page = req.query.page ? parseInt(req.query.page) : 1,
        size = 5,
        skip = page > 0 ? ((page - 1) * size) : 0;

    var query = commentRepository.findAllByQuery({
        "area.id": req.params.id, "area.name": enums.area.Question
    }, skip, size);
    query.populate("commenter", "displayName avatar");
    query.lean();

    query.exec(function(err, docs) {
        if (err) {
            return callback(err);
        }

        _.forEach(docs, function(doc) {
            doc = formatComment(req, doc);
        });

        callback(null, {
            data: docs
        });
    });
};

exports.addComment = addComment;
exports.getComments = getComments;