var User             = require("../models/user"),
    oAuthConfig      = require("../config/oAuth"),
    jwt              = require("jwt-simple"),
    LocalStrategy    = require("passport-local").Strategy,
    BearerStrategy   = require("passport-http-bearer").Strategy,
    GoogleStrategy   = require("passport-google-oauth").OAuth2Strategy,
    GitHubStrategy   = require("passport-github").Strategy,
    FacebookStrategy = require("passport-facebook").Strategy;

module.exports = function(passport) {
    "use strict";

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    /**
     =========================================================================
     ============================== HTTP BEARER ==============================
     =========================================================================
     */
    passport.use("http-bearer", new BearerStrategy(function(token, done) {
        if(token) {
            try {
                var decodedToken = jwt.decode(token, "a17dd903-6ffa-46d4-901a-3d34b55fce2b");

                if(decodedToken.exp <= Date.now()) {
                    return done(null, false);
                }

                User.findOne({ _id: decodedToken.iss }, function (err, user) {
                    if(err) {
                        return done(err);
                    }
                    if(!user) {
                        return done(null, false);
                    }
                    return done(null, user, { scope: "read" });
                });
            } catch(err) {
                done(null, false);
            }
        }
    }));

    /**
     =========================================================================
     ============================= LOCAL SIGNUP ==============================
     =========================================================================
     */

    passport.use("local-signup", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, function(req, email, password, done) {
        if(email) {
            email = email.toLowerCase();
        }

        process.nextTick(function() {
            User.findOne({ $or: [
                { "local.email": email },
                { "facebook.email": email },
                { "twitter.email": email },
                { "google.email": email },
                { "github.email": email }
            ]}, function(err, user) {
                if(err) {
                    return done(err);
                }

                if(user) {
                    return done(null, false, { message: "Email address is already registered." });
                } else {
                    var newUser = new User();

                    newUser.displayName = req.body.name;
                    newUser.local.name = req.body.name;
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err) {
                        if(err) {
                            return done(err);
                        }
                        done(null, newUser);
                    });
                }
            });
        });
    }));

    /*
     =========================================================================
     =============================== FACEBOOK ================================
     =========================================================================
     */

    passport.use(new FacebookStrategy({
        clientID: oAuthConfig.facebook.clientID,
        clientSecret: oAuthConfig.facebook.clientSecret,
        callbackURL: oAuthConfig.facebook.callbackURL
    }, function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ $or: [
                { "facebook.id" : profile.id },
                { "local.email": profile.emails[0].value },
                { "twitter.email": profile.emails[0].value },
                { "google.email": profile.emails[0].value },
                { "github.email": profile.emails[0].value }
            ]}, function(err, user) {
                if(err) {
                    return done(err);
                }

                if(user) {
                    if(!user.facebook.token) {
                        user.facebook.token = token;
                        user.facebook.name = profile.name.givenName + " " + profile.name.familyName;
                        user.facebook.email = profile.emails[0].value;

                        user.save(function(err) {
                            if(err) {
                                return done(err);
                            }
                            done(null, user);
                        });
                    } else {
                        done(null, user);
                    }
                } else {
                    var newUser = new User();

                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.name.givenName + " " + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;
                    newUser.displayName = newUser.facebook.name;

                    newUser.save(function(err) {
                        if(err) {
                            throw err;
                        }
                        done(null, newUser);
                    });
                }
            });
        });
    }));

    /**
     =========================================================================
     ================================ GOOGLE =================================
     =========================================================================
     */

    passport.use(new GoogleStrategy({
            clientID: oAuthConfig.google.clientID,
            clientSecret: oAuthConfig.google.clientSecret,
            callbackURL: oAuthConfig.google.callbackURL
        },
        function(token, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({ $or: [
                    { "google.id": profile.id },
                    { "facebook.email": profile.emails[0].value },
                    { "local.email": profile.emails[0].value },
                    { "twitter.email": profile.emails[0].value },
                    { "github.email": profile.emails[0].value }
                ]}, function(err, user) {
                    if(err) {
                        return done(err);
                    }

                    if(user) {
                        if(!user.google.token) {
                            user.google.token = token;
                            user.google.name = profile.displayName;
                            user.google.email = profile.emails[0].value;

                            user.save(function(err) {
                                if(err) {
                                    return done(err);
                                }
                                done(null, user);
                            });
                        } else {
                            done(null, user);
                        }
                    } else {
                        var newUser = new User();
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value;
                        newUser.displayName = profile.displayName;

                        newUser.save(function(err) {
                            if(err) {
                                return done(err);
                            }
                            done(null, newUser);
                        });
                    }
                });
            });
        }));

    /**
     =========================================================================
     ================================ GITHUB =================================
     =========================================================================
     */

    passport.use(new GitHubStrategy({
        clientID: oAuthConfig.github.clientID,
        clientSecret: oAuthConfig.github.clientSecret,
        callbackURL: oAuthConfig.github.callbackURL
    }, function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ $or: [
                { "github.id": profile.id },
                { "facebook.email": profile.emails[0].value },
                { "google.email": profile.emails[0].value },
                { "local.email": profile.emails[0].value },
                { "twitter.email": profile.emails[0].value }
            ]}, function(err, user) {
                if(err) {
                    return done(err);
                }

                if(user) {
                    if(!user.github.id) {
                        user.github.id = profile.id;
                        user.github.name = profile.displayName;
                        user.github.email = profile.emails[0].value;
                        user.github.username = profile.username;

                        user.save(function(err) {
                            if(err) {
                                return done(err);
                            }
                            done(null, user);
                        });
                    } else {
                        done(null, user);
                    }
                } else {
                    var newUser = new User();
                    newUser.github.id = profile.id;
                    newUser.github.name = profile.displayName;
                    newUser.github.email = profile.emails[0].value;
                    newUser.github.username = profile.username;
                    newUser.displayName = profile.displayName;

                    newUser.save(function(err) {
                        if(err) {
                            return done(err);
                        }
                        done(null, newUser);
                    });
                }
            });
        });
    }));
};