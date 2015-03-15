var Question = require("../models/question");

var findAll = function(skip, size, callback) {
    "use strict";

    Question.where({}).count(function(err, count) {
        if(err) {
            return callback(err);
        }
        callback(null, Question.find({}).skip(skip).limit(size), count);
    });
};

exports.findAll = findAll;