var _        = require("lodash"),
    Tag      = require("../models/tag"),
    User     = require("../models/user"),
    faker    = require("Faker"),
    async    = require("async"),
    enums    = require("../config/enums"),
    Badge    = require("../models/badge"),
    Answer   = require("../models/answer"),
    Comment  = require("../models/comment"),
    Question = require("../models/question");

var tags = [],
    users = [],
    comments = [],
    numOfTags = 200,
    questions = [],
    numOfUsers = 10,
    numOfBadges = 200,
    numOfAnswers = 1000,
    numOfComments = 1000,
    numOfQuestions = 500;

var randomSelector = function(collections, numOfItems) {
    "use strict";

    numOfItems = numOfItems || 10;

    var items = _.random(1, numOfItems),
        array = [];

    for(var idx = 0; idx < items; idx++) {
        array.push(collections[ _.random(0, collections.length - 1) ]);
    }

    return _.uniq(array);
};

var tagSeeder = function(callback) {
    "use strict";

    var array = [];
    for(var idx = 0; idx < numOfTags; idx++) {
        array.push(idx);
    }

    async.each(array, function(idx, asyncCallback) {
        new Tag({
            name: faker.Internet.userName(),
            description: faker.Lorem.sentences(2),
            followers: randomSelector(users),
            creator: users[ _.random(0, numOfUsers - 1) ]._id
        }).save(function(err, doc) {
                tags.push(doc);
                asyncCallback();
            });
    }, function() {
        callback(null, "Tag seeder completed.");
    });
};

var badgeSeeder = function(callback) {
    "use strict";

    var categories = [ "question", "answer", "participation", "moderation", "other" ],
        array = [];

    for(var idx = 0; idx < numOfBadges; idx++) {
        array.push(idx);
    }

    async.each(array, function(idx, outerAsyncCallback) {
        new Badge({
            title: faker.Internet.userName(),
            description: faker.Lorem.sentences(2),
            awarded: randomSelector(users),
            category: categories[ _.random(0, 4) ],
            color: ["bronze", "silver", "gold"][_.random(0, 2)]
        }).save(function(err, badge) {
                async.each(badge.awarded, function(user, innerAsyncCallback) {
                    User.update({ _id: user }, { $addToSet: { badges: badge._id }}, function() {
                        innerAsyncCallback();
                    });
                }, function() {
                    outerAsyncCallback();
                });
            });
    }, function() {
        callback(null, "Badge seeder completed.");
    });
};

var userSeeder = function(callback) {
    "use strict";

    var array = [];
    for(var idx = 0; idx < numOfUsers; idx++) {
        array.push(idx);
    }

    async.each(array, function(idx, asyncCallback) {
        var user = new User();

        user.local.name = faker.Name.findName();
        user.displayName = user.local.name;
        user.local.email = faker.Internet.email();
        user.local.password = user.generateHash("123456");
        user.location = faker.Address.ukCountry();
        user.website = "http://www." + faker.Internet.domainName();

        user.save(function(err, doc) {
            users.push(doc);
            asyncCallback();
        });
    }, function() {
        var user = new User();
        user.local.name = "Administrator";
        user.displayName = "Administrator";
        user.local.email = "admin@mongo-overflow.com";
        user.local.password = user.generateHash("admin");
        user.location = "Mars";
        user.role = enums.role.Admin;

        user.save(function(err, doc) {
            users.push(doc);
            callback(null, "User seeder completed.");
        });
    });
};

var questionSeeder = function(callback) {
    "use strict";

    var array = [];
    for(var idx = 0; idx < numOfQuestions; idx++) {
        array.push(idx);
    }

    async.each(array, function(idx, outerAsyncCallback) {
        new Question({
            title: faker.Lorem.sentence(),
            description: faker.Lorem.paragraphs(5),
            creator: users[ _.random(0, numOfUsers - 1) ]._id,
            tags: randomSelector(tags)
        }).save(function(err, question) {
                questions.push(question);
                async.each(question.tags, function(tag, innerAsyncCallback) {
                    Tag.update({ _id: tag }, { $addToSet: { tagged: question._id }}, function() {
                        innerAsyncCallback();
                    });
                }, function() {
                    outerAsyncCallback();
                });
            });
    }, function() {
        callback(null, "Question seeder completed.");
    });
};

var commentSeeder = function(callback) {
    "use strict";

    var array = [];
    for(var idx = 0; idx < numOfComments; idx++) {
        array.push(idx);
    }

    async.each(array, function(idx, asyncCallback) {
        var question = questions[ _.random(0, numOfQuestions - 1) ]._id;

        new Comment({
            text: faker.Lorem.sentences(_.random(1, 3)),
            commenter: users[ _.random(0, numOfUsers - 1) ]._id,
            question: question,
            parentId: question
        }).save(function(err, comment) {
                comments.push(comment);
                asyncCallback();
            });
    }, function() {
        callback(null, "Comment seeder completed.");
    });
};

var answerSeeder = function(callback) {
    "use strict";

    var array = [];
    for(var idx = 0; idx < numOfAnswers; idx++) {
        array.push(idx);
    }

    async.each(array, function(idx, asyncCallback) {
        new Answer({
            text: faker.Lorem.sentences(_.random(1, 3)),
            creator: users[ _.random(0, numOfUsers - 1) ]._id,
            question: questions[ _.random(0, numOfQuestions - 1) ]._id
        }).save(function() {
                asyncCallback();
            });
    }, function() {
        callback(null, "Answer seeder completed.");
    });
};

exports.seed = function () {
    "use strict";

    async.series([ userSeeder, tagSeeder, badgeSeeder, questionSeeder, commentSeeder, answerSeeder], function(err, messages) {
        _.forEach(messages, function(message) {
            console.info(message);
        });
    });
};