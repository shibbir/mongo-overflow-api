var jwt      = require("jwt-simple"),
    app      = require("../config/express")(),
    faker    = require("Faker"),
    User     = require("../models/user"),
    async    = require("async"),
    Comment  = require("../models/comment"),
    Question = require("../models/question"),
    moment   = require("moment");

exports.getAccessToken = function(callback) {
    "use strict";

    var newUser = new User();

    newUser.local.email = faker.Internet.email().toLowerCase();
    newUser.local.name = faker.Name.findName();
    newUser.local.password = newUser.generateHash("xxx-xxx");
    newUser.displayName = newUser.local.name;
    newUser.location = faker.Address.ukCountry();

    newUser.save(function(err, user) {
        if (err) {
            return callback(err);
        }

        var token = jwt.encode({
            iss: user._id,
            exp: moment().add(7, "days").valueOf()
        }, app.get("jwtTokenSecret"));

        callback(null, user, token);
    });
};

exports.getQuestion = function(user, callback) {
    "use strict";

    new Question({
        title: faker.Lorem.sentence(),
        description: faker.Lorem.paragraphs(5),
        creator: user._id
    }).save(function(err, question) {
            callback(question);
        });
};

exports.reset = function(callback) {
    "use strict";

    async.parallel([
            function(asyncCallback) {
                Question.remove({}, function() {
                    asyncCallback(null);
                });
            },
            function(asyncCallback) {
                Comment.remove({}, function() {
                    asyncCallback();
                });
            },
            function(asyncCallback) {
                User.remove({}, function() {
                    asyncCallback();
                });
            }
        ],
        function() {
            callback();
        });
};