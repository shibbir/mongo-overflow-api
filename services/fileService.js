var File = require("../models/file");

var getFileType = function(file) {
    "use strict";

    var fileType;

    if(file.mimetype.toLowerCase().indexOf("video") !== -1) {
        fileType = "video";
    }

    if(file.mimetype.toLowerCase().indexOf("image") !== -1) {
        fileType = "image";
    }
    return fileType;
};

var add = function(file, callback) {
    "use strict";

    new File({
        fileName: file.name,
        extension: file.extension,
        relativePath: "/uploads/" + file.name,
        fileType: getFileType(file),
        mimeType: file.mimetype,
        encodingType: file.encoding,
        sizeInBytes: file.size
    }).save(function(err, doc) {
            if(err) {
                return callback(err);
            }
            callback(null, doc);
        });
};

exports.add = add;