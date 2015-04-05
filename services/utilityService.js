var constants = require("../config/constants");

var getHost = function(req) {
    "use strict";
    return req.hostname;
};

var getProtocol = function(req) {
    "use strict";
    return req.protocol;
};

var calcAge = function(dateString) {
    "use strict";

    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if(m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

var isSameObjectId = function(propA, propB) {};

var getPublicUploadPath = function(req) {
    "use strict";

    return getProtocol(req) + "://" + "localhost:7575" + constants.UPLOAD_ROOT;
};

exports.calcAge = calcAge;
exports.getHost = getHost;
exports.getProtocol = getProtocol;
exports.isSameObjectId = isSameObjectId;
exports.getPublicUploadPath = getPublicUploadPath;