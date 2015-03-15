var mongoose = require("mongoose"),
    Schema   = mongoose.Schema,
    enums    = require("../../config/enums");

var ReputationSchema = Schema({
    contributor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    appreciator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    reputationType: {
        type: String,
        enum: [ enums.reputation.UpVote, enums.reputation.DownVote, enums.reputation.Accepted ]
    },
    area: {
        id: Schema.Types.ObjectId,
        type: {
            type: String,
            enum: [ enums.reputation.Question, enums.reputation.Answer, enums.reputation.Comment ]
        }
    },
    contribution: {
        asked: Boolean,
        answered: Boolean,
        commented: Boolean,
        votedDown: Boolean,
        accepted: Boolean
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = ReputationSchema;