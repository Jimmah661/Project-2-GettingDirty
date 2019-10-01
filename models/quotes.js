module.exports = function(sequelize, DataTypes) {
  var Quotes = sequelize.define("Quotes", {
    quoteID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Quotes.associate = function(models) {
    Quotes.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    Quotes.belongsTo(models.Products, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Quotes;
}