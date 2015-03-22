var User = require("../models/user");

var find = function(id) {
    "use strict";
    return User.findOne({ _id: id });
};

var findAll = function(skip, size) {
    "use strict";
    return User.find({}).skip(skip).limit(size);
};

var update = function(conditions, update, options, callback) {
    "use strict";

    User.update(conditions, update, options, function(err) {
        if(err) {
            return callback(err);
        }
        callback(null);
    });
};

var findByIdAndUpdate = function(id, update, callback) {
    "use strict";

    User.findByIdAndUpdate(id, update, function(err, doc) {
        if(err) {
            return callback(err);
        }
        callback(null, doc);
    });
};

exports.find = find;
exports.findAll = findAll;
exports.update = update;
exports.findByIdAndUpdate = findByIdAndUpdate;