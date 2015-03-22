var Question = require("../models/question");

var find = function(id) {
    "use strict";

    return Question.findOne({ _id: id });
};

var findByQuery = function(query, callback) {
    "use strict";

    Question.findOne(query, function(err, doc) {
        if(err) {
            return callback(err);
        }
        callback(null, doc);
    });
};

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

var update = function(query, update, callback) {
    "use strict";

    Question.update(query, update, function(err) {
        if(err) {
            return callback(err);
        }
        callback(null);
    });
};

var findByIdAndUpdate = function(id, update, callback) {
    "use strict";

    Question.findByIdAndUpdate(id, update, function(err, doc) {
        if(err) {
            return callback(err);
        }
        callback(null, doc);
    });
};

exports.find = find;
exports.insert = insert;
exports.update = update;
exports.findAll = findAll;
exports.findByQuery = findByQuery;
exports.findByIdAndUpdate = findByIdAndUpdate;