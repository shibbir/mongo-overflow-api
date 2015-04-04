var Tag                = require("../models/tag"),
    _                  = require("lodash"),
    User               = require("../models/user"),
    enums              = require("../config/enums"),
    Question           = require("../models/question"),
    validator          = require("validator"),
    constants          = require("../config/constants"),
    utilityService     = require("../services/utilityService"),
    commentRepository  = require("../repositories/commentRepository");

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

        doc = doc.toObject();
        doc.commenter = {
            _id: req.user.id,
            displayName: req.user.displayName,
            avatar: {
                fileName: req.user.avatar,
                absolutePath: utilityService.getProtocol(req) + "://" + "localhost:7575" + constants.UPLOAD_ROOT + req.user.avatar
            }
        };

        callback(null, doc);
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

        callback(null, docs);
    });
};

exports.addComment = addComment;
exports.getComments = getComments;