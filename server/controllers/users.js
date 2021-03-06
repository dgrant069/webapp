/**
 * Created by guillaumez on 4/5/2014.
 */

var db = require('../models');
var crypto = require('crypto');

/**
 * Searches and returns a list of users.
 */
exports.index = function (req, res) {

    // Extract query params
    var limit = isNaN(parseInt(req.query.limit)) ? 20 : parseInt(req.query.limit);
    var offset = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);

    // Find all hosts matching parameters
    db.User.findAll({
        limit: limit,
        offset: offset,
        include: [
            { model: db.Wwoofer },
            { model: db.Host }
        ]
    }).success(function (users) {

        // Count total hosts
        db.User.count({
            // where: where
        }).on('success', function (count) {
            res.send({
                users: users,
                meta: {
                    offset: offset,
                    limit: limit,
                    total: count
                }
            });
        })
    });
};

/**
 * Searches and returns a single user.
 */
exports.single = function (req, res) {
    db.User.find({
        where: {id: req.params.id}
    }).success(function (user) {
        // Not found
        if (!user)
            res.send(404);

        // Unauthorized
        if (user.id != req.user.id)
            res.send(401);

        res.send({
            user: user
        });
    })
};

exports.create = function (req, res) {

    // Make sure email address is not in use
    db.User.find({
        where: { email: req.body.user.email }
    }).success(function (user) {

        // User already exists
        if (user) {
            res.send(409); // Conflict
        }

        // Create a hash of the password
        var passwordHash = crypto.createHash('sha1').update(req.body.user.password).digest("hex");

        // Create the user
        db.User.create({
            firstName: req.body.user.firstName,
            lastName: req.body.user.lastName,
            email: req.body.user.email,
            passwordHash: passwordHash
        }).success(function (user) {

            // Send email
            res.mailer.send('register', {
                to: user.email,
                subject: 'Welcome to Wwoof France!',
                firstName: user.firstName
            }, function (err) {
                if (err) {
                    console.log(err);
                    res.send(500);
                }
                res.send(201);
            });
        })
    })
};