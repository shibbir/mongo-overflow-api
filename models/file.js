var mongoose = require("mongoose"),
    Schema   = mongoose.Schema;

var FileSchema = Schema({
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    extension: {
        type: String
    },
    sizeInBytes: {
        type: Number
    },
    encodingType: {
        type: String
    },
    mimeType: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("File", FileSchema);