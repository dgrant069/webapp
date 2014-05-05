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
                    { email: 'plop@plop.com', passwordHash: 'thisisnotarealhash', firstName: 'Bob', lastName: 'Dylan', birthDate: '1989-06-25 04:15:10', phone: '206-012-3465' },
                    { email: 'host@foo.com', passwordHash: '64faf5d0b1dc311fd0f94af64f6c296a03045571', firstName: 'Jean', lastName: 'Bon', birthDate: '1977-02-08 04:15:10', phone: '206-012-3465' },
                    { email: 'woofer@foo.com', passwordHash: '64faf5d0b1dc311fd0f94af64f6c296a03045571', firstName: 'Helen', lastName: 'Polmino', birthDate: '1984-10-10 10:10:25', phone: '206-012-3465' }
                ]).success(function () {
                    db.Host.bulkCreate([
                        { farmName: 'La Belle Ferme', shortDescription: 'Ferme Bio dans le marais', fullDescription: 'Une description complete prendrait trop de place.', webSite: 'http://pouet.com', travelDetails: 'On vient vous prendre a la gare y\' pas sourcis!', addressId: 1, userId: 1 },
                        { farmName: 'La Grange Verte', shortDescription: 'Ferme de fromages bio!', fullDescription: 'Encore un fois, une description complete prendrait trop de place.', webSite: 'http://plop.com', travelDetails: 'On vient vous prendre a la gare y\' pas sourcis!', addressId: 2, userId: 2 }
                    ]).success(function () {
                        db.Photo.bulkCreate([
                            { fileName: 'maison.jpg', caption: 'Photo de Maison', hostId: 1 },
                            { fileName: 'arbre.jpg', caption: 'Ceci est un arbre', hostId: 1 },
                            { fileName: 'farm.jpg', caption: 'This is a farm', hostId: 1 }
                        ]).success(function () {
                            db.Wwoofer.bulkCreate([
                                { firstName2: 'Another', lastName2: 'Name', birthDate2: '1985-03-24 18:15:10', nationality: 'FR', tripMotivation: 'Je veux apprendre a faire du fromage!', addressId: 3, userId: 3 }
                            ]).success(function () {
                                db.Token.bulkCreate([
                                    { id: 2, token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjJ9.HNHWrX1U9ITwMneIUfAlFUNZFWNYrHcyhDAJoSCkqOI', expireAt: '2015-04-14 04:16:44' },
                                    { id: 3, token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjN9.Y632WD309lAXGpRghiXaLt-X8J69qcnB6BITiyTcFeA', expireAt: '2015-04-14 04:16:44' }
                                ])
                            })
                        })
                    })
                })
            })
        })
    })
};