var mongoose = require("mongoose"),
    Schema   = mongoose.Schema;

var CommentSchema = Schema({
    text: {
        type: String,
        required: true
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question"
    },
    parentId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    commenter: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    flags: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
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

module.exports = mongoose.model("Comment", CommentSchema);