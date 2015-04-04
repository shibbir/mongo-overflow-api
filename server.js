var mongoose = require("mongoose"),
    config   = require("./config/env/development"),
    passport = require("passport");

var app = require("./config/express")();

if (app.settings.env === "production") {
    config = require("./config/env/production");
}

require("./config/passport")(passport);
mongoose.connect(config.db.url);
require("./config/mongoose")(mongoose);

require("./routes/documentation")(app);
require("./routes/account")(app, passport);
require("./routes/user")(app, passport);
require("./routes/question")(app, passport);
require("./routes/tag")(app, passport);

//require("./config/seeder").seed();

app.listen(app.get("port"), function() {
    "use strict";
    console.info("Api running on port %s in %s mode", app.get("port"), app.settings.env);
});