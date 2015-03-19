var Question = require("../models/question");

var insert = function(model, callback) {
    "use strict";

    var doc = new Question(model);

    doc.save(function(err, doc) {
        if(err) {
            return callback(err);
        }
        callback(null, doc);
    });
};

var findAll = function(skip, size, callback) {
    "use strict";

    Question.where({}).count(function(err, count) {
        if(err) {
            return callback(err);
        }
        callback(null, Question.find({}).skip(skip).limit(size), count);
    });
};

exports.insert = insert;
exports.findAll = findAll;