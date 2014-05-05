module.exports = function (sequelize, DataTypes) {
    var Wwoofer = sequelize.define('Wwoofer', {
        firstName2: DataTypes.STRING,
        lastName2: DataTypes.STRING,
        birthDate2: DataTypes.DATE,
        nationality: DataTypes.STRING,
        tripDuration: DataTypes.STRING,
        tripMotivation: DataTypes.STRING,
        intro: DataTypes.STRING,
        comment: DataTypes.STRING,
        //paymentStatus: DataTypes.INTEGER,
        //memId: DataTypes.STRING,
        //txnId: DataTypes.STRING,
        itemCode: DataTypes.INTEGER, // Convert to enum
        paymentType: DataTypes.ENUM('PPL', 'CHQ'),
        deletionDate: DataTypes.DATE
    }, {
        tableName: 'wwoofers',
        classMethods: {
            associate: function (models) {
                Wwoofer.belongsTo(models.User);
                Wwoofer.belongsTo(models.Address)
            }
        }
    });
    return Wwoofer
};