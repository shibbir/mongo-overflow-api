var Tag = require("../models/tag");

var findAll = function(skip, size, callback) {
    "use strict";

    Tag.where({}).count(function(err, count) {
        if(err) {
            return callback(err);
        }
        callback(null, Tag.find({}).skip(skip).limit(size), count);
    });
};

exports.findAll = findAll;