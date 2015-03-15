var mongoose = require("mongoose"),
    Schema   = mongoose.Schema;

var TagSchema = Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Tag", TagSchema);