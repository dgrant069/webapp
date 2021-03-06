/**
 * API controller for Wwoofers.
 */
var db = require('../models');

/**
 * Search and returns a list of wwoofers.
 */
exports.index = function (req, res) {

    // Extract query params
    var limit = isNaN(parseInt(req.query.limit)) ? 20 : parseInt(req.query.limit),
        offset = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
//        dpt = (req.query.dpt || '') + '%',
//        searchTerm = req.query.searchTerm || '',
//        where = ["contact like ? and zipCode like ?", '%' + searchTerm + '%', dpt + '%'];

    // Find all wwofers matching parameters
    db.Wwoofer.findAndCountAll({
        include: [
            { model: db.User, as: 'user' },
            { model: db.Address, as: 'address', include: [
                { model: db.Department },
                { model: db.Country }
            ]
            }
        ],
        limit: limit,
        offset: offset
        // where: where
    }).success(function (wwoofers) {
        res.send({
            wwoofers: wwoofers.rows,
            meta: {
                offset: offset,
                limit: limit,
                total: wwoofers.count
            }
        });
    });
};

/**
 * Search and returns a single wwoofer.
 */
exports.single = function (req, res) {
    db.Wwoofer.find({
        where: {id: req.params.id},
        include: [
            { model: db.User },
            { model: db.Address, include: [
                { model: db.Department },
                { model: db.Country }
            ]
            }
        ]
    }).success(function (wwoofer) {
        // Not found
        if (!wwoofer)
            res.send(404);

        res.send({
            wwoofer: wwoofer
        });
    })
};