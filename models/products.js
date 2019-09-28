module.exports = function(sequelize, DataTypes) {
    var Products = sequelize.define("Products", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    })
    Products.associate= function(models) {
        Products.hasMany(models.Quotes, {});
    }

    return Products;
}