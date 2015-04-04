var Comment = require("../models/comment");

var insert = function(model, callback) {
    "use strict";

    var doc = new Comment(model);

    doc.save(function(err, doc) {
        if (err) {
            return callback(err);
        }
        callback(null, doc);
    });
};

var findAllByQuery = function(query, skip, size) {
    "use strict";
    return Comment.find(query).skip(skip).limit(size);
};

exports.insert = insert;
exports.findAllByQuery = findAllByQuery;