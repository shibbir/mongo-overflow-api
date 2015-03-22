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

exports.calcAge = calcAge;
exports.getHost = getHost;
exports.getProtocol = getProtocol;
exports.isSameObjectId = isSameObjectId;