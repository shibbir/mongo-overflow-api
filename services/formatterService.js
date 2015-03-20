var _ = require("lodash");

exports.formatValidation = function(err) {
    "use strict";

    var messages = [];

    if(err.name === "ValidationError") {
        messages = _.pluck(_.flatten(_.map(err.errors, function(items) {
            return items;
        })), "message");
    } else if(err.name === "MongoError") {
        if(err.code === 11000) {
            messages.push("Duplicate index error happened.");
        }
    }

    return {
        type: err.name,
        messages: messages
    };
};