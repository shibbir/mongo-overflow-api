var request  = require("supertest"),
    app      = require("../config/express")(),
    should   = require("should"),
    config   = require("../config/env/development"),
    mongoose = require("mongoose"),
    Tag      = require("../models/tag"),
    passport = require("passport");

require("../config/passport")(passport);

require("../routes/tag")(app, passport);

describe("Tag Routes", function() {

    before(function(done) {
        mongoose.connect(config.db.testUrl);
        done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    describe("GET /api/tags", function() {
        it("should return paginated tag collection", function(done) {
            request(app)
                .get("/api/tags")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res) {
                    if(err) {
                        throw err;
                    }
                    res.body.should.have.property("data");
                    res.body.should.have.property("pagination");
                    res.body.data.length.should.not.be.above(36);
                    done();
                });
        });
    });
});