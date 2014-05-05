var express = require('express'),
    http = require('http'),
    app = express(),
    db = require('./server/models'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    jwt = require('jwt-simple'),
    config = require('./config'),
    moment = require('moment'),
    mailer = require('express-mailer'),
    jade = require('jade'),
    crypto = require('crypto'),
    domain = require('domain'),
    paypal = require('paypal-rest-sdk'),
    session = require('express-session'),
    SessionStore = require('express-mysql-session');

// Configure express app
app.set('port', process.env.PORT || config.port);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');

// Configure paypal
paypal.configure(config.paypal);

// Configure mailer (must be called before "app.use(app.router)")
mailer.extend(app, config.smtp);

// Global error handler
// Note: must be improved to use clusters (see http://nodejs.org/api/domain.html)
function domainWrapper() {
    return function (req, res, next) {
        var reqDomain = domain.create();
        reqDomain.add(req);
        reqDomain.add(res);

        res.on('close', function () {
            reqDomain.dispose();
        });
        reqDomain.on('error', function (err) {
            next(err);
        });
        reqDomain.run(next);
    }
}

// Configure session
app.use(express.cookieParser());
app.use(session({
    secret: config.session_secret,
    store: new SessionStore(config.mysql_session)
}));

// Configure the rest of the application
app.use(domainWrapper());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.static('public'));
app.use(passport.initialize());
app.use(app.router);

    app.use(express.logger('dev'));

// Development only configuration
app.configure('development', function () {

    app.use(express.errorHandler());
});

// Init all routes
require('./server/routes')(app);

// Configure authentication middleware
passport.use(new LocalStrategy(
    function (username, password, done) {

        console.log('Authenticating user \'' + username + '\'');

        // Process the hash of the password
        var passwordHash = crypto.createHash('sha1').update(password).digest("hex");

        db.User.find({
            where: { email: username }
        }).success(function (user) {
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.passwordHash !== passwordHash) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            db.Token
                .findOrCreate({id: user.id}, {id: user.id})
                .success(function (token) {

                    // Generate the token if not present
                    if (!token.token) {
                        var payload = {
                            userId: user.id
                        };
                        token.token = jwt.encode(payload, config.jwt_secret);
                    }

                    // Set the token expiration date (one hour from now)
                    var now = new Date();
                    token.expireAt = now.setHours(now.getHours() + 1);

                    // Save the token
                    token
                        .save()
                        .success(function () {
                            console.log('Authenticated user: ' + user.email);
                            console.log('Token expires: ' + moment(token.expireAt).format('MMMM Do YYYY, h:mm:ss a'));
                            return done(null, user);
                        })
                })
        })
    }
));
passport.use(new BearerStrategy(
    function (token, done) {

        console.log('Validating user token...');

        db.Token.find({
            where: { token: token }
        }).success(function (dbToken) {

            // Failed authentication if token was not found
            if (!dbToken)
                return done(null, false);

            // Decode token
            var decodedToken = jwt.decode(token, config.jwt_secret);

            // Make sure the user id in the JWT token matches the id of the token
            if (!decodedToken || !decodedToken.userId || (decodedToken.userId != dbToken.id))
                return done(null, false);

            // Check whether the token is expired
            var now = new Date();
            if (dbToken.expireAt < now)
                return done(null, false);

            // Delay the token expiration date to be in 1 hour from now
            dbToken.expireAt = now.setHours(now.getHours() + 1);
            console.log('Token expires: ' + moment(dbToken.expireAt).format('MMMM Do YYYY, h:mm:ss a'));

            // Save the token
            dbToken.save()
                .success(function () {

                    // Find the user in the DB
                    db.User
                        .find(dbToken.id)
                        .success(function (user) {
                            return done(null, user);
                        })
                        .error(function (err) {
                            return done(null, false);
                        });

                }).error(function (err) {
                    return done(null, false);
                });
        })
    }
));

// Init Sequelize and start server
db
    .sequelize
    .query('SET FOREIGN_KEY_CHECKS = 0')
    .then(function () {
        return db.sequelize.sync({ force: true });
    })
    .then(function () {
        return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    })
    .then(function () {
        console.log('Database synchronised.');

        // Load sample data in the database
        require('./server/bootstrap-db')(db);

        http.createServer(app).listen(app.get('port'), function () {
            console.log('Express server listening on port ' + app.get('port'))
        })

    }, function (err) {
        console.log(err);
    });


//db
//    .sequelize
//    .sync({ force: true })
//    .complete(function (err) {
//
//
//
//        if (err) {
//            throw err
//        } else {
//            http.createServer(app).listen(app.get('port'), function () {
//                console.log('Express server listening on port ' + app.get('port'))
//            })
//        }
//    });
