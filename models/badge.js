var mongoose = require("mongoose"),
    Schema   = mongoose.Schema;

var BadgeSchema = Schema({
    title: String,
    description: String,
    category: {
        type: String,
        enum: ["question", "answer", "participation", "moderation", "other"]
    },
    color: {
        type: String,
        enum: ["bronze", "silver", "gold"]
    },
    awarded: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("Badge", BadgeSchema);