var mongoose = require("mongoose"),
    Schema   = mongoose.Schema,
    enums    = require("../config/enums");

var CommentSchema = Schema({
    text: {
        type: String,
        required: true
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question"
    },
    area: {
        id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            enum: [ enums.area.Question, enums.area.Answer ]
        }
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