module.exports = function (db) {
    db.Country.bulkCreate([
        { code: 'FR', name: 'France' },
        { code: 'US', name: 'United States' },
        { code: 'PT', name: 'Portugal' }
    ]).success(function () {
        db.Department.bulkCreate([
            { code: '03', name: 'Allier', region: '1' },
            { code: '83', name: 'Var', region: '1' },
            { code: '06', name: 'Hautes-Alpes', region: '1' }
        ]).success(function () {
            db.Address.bulkCreate([
                { address1: 'Rue des Oliviers', address2: 'La Maisonette', zipCode: '03220', city: 'Trezelles', departmentId: 1, countryId: 1 },
                { address1: 'Avenue des Bozo', address2: 'Rouberre', zipCode: '83521', city: 'Vieilloles', departmentId: 2, countryId: 1 },
                { address1: '1415 E Denny Way', address2: 'Capitol Hill', zipCode: '98122', city: 'Seattle', state: 'WA', countryId: 2 }
            ]).success(function () {
                db.User.bulkCreate([
                    { email: 'plop@plop.com', passwordHash: 'thisisnotarealhash', firstName: 'Bob', lastName: 'Dylan', birthDate: '1989-06-25 04:15:10', phone: '206-012-3465' }
                ]).success(function () {
                    db.Host.bulkCreate([
                        { farmName: 'La Belle Ferme', shortDescription: 'Ferme Bio dans le marais', fullDescription: 'Une description complete prendrait trop de place.', webSite: 'http://pouet.com', travelDetails: 'On vient vous prendre a la gare y\' pas sourcis!', addressId: 1, userId: 1 }
                    ]).success(function () {
                        db.Photo.bulkCreate([
                            { fileName: 'maison.png', caption: 'Photo de Maison', hostId: 1 },
                            { fileName: 'arbre.png', caption: 'Ceci est un arbre', hostId: 1 },
                            { fileName: 'farm.png', caption: 'This is a farm', hostId: 1 }
                        ])
                    })
                })
            })
        })
    })
};