var _        = require("lodash"),
    mongoose = require("mongoose"),
    Schema   = mongoose.Schema;

var QuestionSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bounty: Number,
    flags: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag"
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: "Answer"
    }],
    upVotes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    downVotes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    views: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    date: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    }
});

QuestionSchema.methods.isUpVoted = function(userId) {
    "use strict";
    return undefined !== _.findWhere(this.upVotes, function(chr) { return chr.toString() === userId.toString; });
};

QuestionSchema.methods.isDownVoted = function(userId) {
    "use strict";
    return undefined !== _.findWhere(this.downVotes, function(chr) { return chr.toString() === userId.toString; });
};

module.exports = mongoose.model("Question", QuestionSchema);