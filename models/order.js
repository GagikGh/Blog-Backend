'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
        onDelete: 'CASCADE',
      });
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'orderReceiver',
        onDelete: 'CASCADE',
      })
    }
  }
  Order.init({
    productId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    count: DataTypes.INTEGER,
    stripeOrderId: DataTypes.STRING,
    createdAt: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: false,
  });
  return Order;
};
