var _                 = require("lodash"),
    fs                = require("fs"),
    moment            = require("moment"),
    validator         = require("validator"),
    utilityService    = require("../services/utilityService"),
    userRepository    = require("../repositories/userRepository"),
    formatterService  = require("./formatterService"),
    reputationService = require("../services/reputationService");

var formatUserViewModel = function(req, user) {
    "use strict";

    if(user.birthday) {
        user.age = utilityService.calcAge(user.birthday.year + "/" + user.birthday.month + "/" + user.birthday.day);
        user.date = moment(user.date).format("MMMM D, YYYY");
    }

    if(user.local) {
        user.name = user.local.name;
        user.email = user.local.email;
        delete user.local;
    }

    user.points = reputationService.getPoints(user._id, user.reputations);

    delete user.reputations;

    if(user.avatar) {
        user.avatar.absolutePath = utilityService.getPublicUploadPath(req) + user.avatar.fileName;
    }

    return user;
};

var getUser = function(req, res) {
    "use strict";

    userRepository
        .find(req.params.id)
        .select("local.name local.email displayName avatar location website bio birthday views date reputations")
        .exec(function(err, doc) {
            if(err) {
                return res.sendStatus(500);
            }

            res.status(200).json(formatUserViewModel(req, doc.toObject()));
        });
};

var addViewer = function(req, res) {
    "use strict";

    if(req.params.id.toString() === req.user.id.toString()) {
        return res.sendStatus(200);
    }

    userRepository.findByIdAndUpdate(req.params.id, { $addToSet: { views: req.user.id }}, function(err, doc) {
        if(err) {
            return res.sendStatus(500);
        }
        res.status(200).json(doc.views);
    });
};

var updateInfo = function(req, res) {
    "use strict";

    if(req.params.id !== req.user.id.toString()) {
        return res.sendStatus(401);
    }

    var model = {
        "local.name": req.body.name,
        "local.email": req.body.email,
        displayName: req.body.displayName
    };

    if(!_.isUndefined(req.body.bio)) {
        model.bio = validator.escape(req.body.bio);
    }

    if(!_.isUndefined(req.body.website)) {
        model.website = validator.escape(req.body.website);
    }

    if(!_.isUndefined(req.body.location)) {
        model.location = validator.escape(req.body.location);
    }

    if(req.body.birthday && !isNaN(req.body.birthday.day) && !isNaN(req.body.birthday.month) && !isNaN(req.body.birthday.year)) {
        model.birthday = {
            day: _.parseInt(req.body.birthday.day),
            month: _.parseInt(req.body.birthday.month),
            year: _.parseInt(req.body.birthday.year)
        };
    }

    userRepository.update({ _id: req.params.id }, { $set: model }, null, function(err) {
        if(err) {
            return res.status(400).json(formatterService.formatError(err));
        }

        res.sendStatus(200);
    });
};

var changeAvatar = function(req, res) {
    "use strict";

    if(req.params.id !== req.user.id.toString()) {
        return res.sendStatus(401);
    }

    if(!req.files.file) {
        return res.sendStatus(400);
    }

    var oldAvatar = req.user.avatar,
        newAvatar = {
            fileName: req.files.file.name,
            relativePath: "/uploads/" + req.files.file.name
        };

    userRepository.update({ _id: req.params.id }, { $set: { avatar: newAvatar }}, null, function(err) {
        if(err) {
            return res.sendStatus(500);
        }

        if(oldAvatar && fs.existsSync("www/uploads/" + oldAvatar.fileName)) {
            fs.unlinkSync("www/uploads/" + oldAvatar.fileName);
        }

        newAvatar.absolutePath = utilityService.getPublicUploadPath(req) + newAvatar.fileName;

        res.status(200).json(newAvatar);
    });
};

var changePassword = function(req, res) {
    "use strict";

    if(req.params.id !== req.user.id.toString()) {
        return res.sendStatus(401);
    }

    if(!req.user.validPassword(req.body.oldPassword)) {
        return res.status(400).json({ message: "Old password is incorrect." });
    }

    if(req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "Confirm password didn't match." });
    }

    userRepository.update({ _id: req.params.id }, { $set: { "local.password": req.user.generateHash(req.body.newPassword) }}, null, function(err) {
        if(err) {
            return res.sendStatus(500);
        }

        res.sendStatus(200);
    });
};

exports.getUser = getUser;
exports.updateInfo = updateInfo;
exports.addViewer = addViewer;
exports.changeAvatar = changeAvatar;
exports.changePassword = changePassword;