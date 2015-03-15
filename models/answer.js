var mongoose = require("mongoose"),
    Schema   = mongoose.Schema;

var AnswerSchema = Schema({
    text: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question"
    },
    flags: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    verdict: {
        type: String,
        enum: ["accepted"]
    },
    upVotes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    downVotes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Answer", AnswerSchema);