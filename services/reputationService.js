var _              = require("lodash"),
    enums          = require("../config/enums"),
    userRepository = require("../repositories/userRepository");

var push = function(userId, model, callback) {
    "use strict";

    userRepository.update({ _id: userId }, { $push: { reputations: model }}, function(err) {
        if(err) {
            return callback(err);
        }
        callback(null);
    });
};

var pull = function(query, callback) {
    "use strict";

    callback(null);
};

var getPoints = function(userId, reputations) {
    "use strict";

    var points = 0;

    _.forEach(reputations, function(doc) {
        if(doc.area.type === enums.area.Question) {
            if(doc.reputationType === enums.reputation.UpVote) {
                /** question is voted up */
                points += enums.reputation.point.QuestionUpVote;
            }

            if(doc.reputationType === enums.reputation.DownVote) {
                /** question is voted down */
                points += enums.reputation.point.QuestionDownVote;
            }
        }

        // below section is not finished
        if(doc.area.type === enums.area.Answer) {
            if(doc.reputationType === enums.reputation.UpVote) {
                /** answer is voted up */
                points += enums.reputation.point.AnswerUpVote;
            }

            if(doc.reputationType === enums.reputation.DownVote) {
                /** answer is voted down */
                points += enums.reputation.point.AnswerDownVote;
            }

            if(doc.reputationType === enums.reputation.Accepted) {
                /** answer is marked “accepted” */
                points += enums.reputation.point.AnswerAccept;
            }
        }
    });
    return points;
};

exports.push = push;
exports.pull = pull;
exports.getPoints = getPoints;

/**
You gain reputation when:

question is voted up: +5 (ok)
answer is voted up: +10 (ok)
answer is marked “accepted”: +15 (+2 to acceptor)
suggested edit is accepted: +2 (up to +1000 total per user)
bounty awarded to your answer: + full bounty amount
one of your answers is awarded a bounty automatically: + half of the bounty amount (see more details about how bounties work)
site association bonus: +100 on each site (awarded a maximum of one time per site)

You lose reputation when:

your question is voted down: −2 (ok)
your answer is voted down: −2 (ok)
you vote down an answer: −1
you place a bounty on a question: − full bounty amount
one of your posts receives 6 spam or offensive flags: −100
*/