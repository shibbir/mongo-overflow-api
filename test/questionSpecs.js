var request  = require("supertest"),
    app      = require("../config/express")(),
    should   = require("should"),
    config   = require("../config/env/development"),
    mongoose = require("mongoose"),
    Question = require("../models/question");

require("../routes/question")(app);

describe("Question Routes", function() {

    before(function(done) {
        mongoose.connect(config.db.testUrl);
        done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    describe("GET /api/questions", function() {
        it("should return questions collection with pagination data", function(done) {
            request(app)
                .get("/api/questions")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if(err) {
                        throw err;
                    }
                    res.body.should.have.property("data");
                    res.body.should.have.property("pagination");
                    res.body.data.length.should.not.be.above(20);
                    done();
                });
        });
    });
});