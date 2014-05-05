var passport = require('passport');
var application = require('./controllers/application');
var login = require('./controllers/login');
var users = require('./controllers/users');
var hosts = require('./controllers/hosts');
var addresses = require('./controllers/addresses');
var photos = require('./controllers/photos');
var departments = require('./controllers/departments');
var wwoofers = require('./controllers/wwoofers');
var countries = require('./controllers/countries');
var paypal = require('./controllers/paypal');

module.exports = function (app) {

    app.get('/payment/start', paypal.start);
    app.get('/payment/execute', paypal.execute);
    app.get('/app*', application.index);

    app.post('/api/request_token', passport.authenticate('local', { session: false }), login.successCallback);

    app.get('/api/users', passport.authenticate('bearer', { session: false }), users.index);
    app.get('/api/users/:id', passport.authenticate('bearer', { session: false }), users.single);
    app.post('/api/users', users.create);

    app.get('/api/hosts', hosts.index);
    app.get('/api/hosts/:id', hosts.single);
    app.put('/api/hosts/:id', passport.authenticate('bearer', { session: false }), hosts.update);
    app.post('/api/hosts', passport.authenticate('bearer', { session: false }), hosts.create);

    app.put('/api/addresses/:id', passport.authenticate('bearer', { session: false }), addresses.update);
    app.post('/api/addresses', passport.authenticate('bearer', { session: false }), addresses.create);
    app.delete('/api/addresses/:id', passport.authenticate('bearer', { session: false }), addresses.delete);

    app.get('/api/photos', photos.index);
    app.get('/api/photos/:id', photos.single);
    app.post('/api/photos', photos.create);

    app.get('/api/departments', departments.index);

    app.get('/api/countries', countries.index);
    app.get('/api/countries/:id', countries.single);

    app.get('/api/wwoofers', passport.authenticate('bearer', { session: false }), wwoofers.index);
    app.get('/api/wwoofers/:id', passport.authenticate('bearer', { session: false }), wwoofers.single);
};
