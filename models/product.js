'use strict';
import {Model} from "sequelize";
export default (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.Order, {
        foreignKey: 'productId',
        as: 'product',
        onDelete: 'CASCADE',
      })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.NUMBER,
    imageUrl: DataTypes.STRING,
    stripeProductId: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: false,
  });
  return Product;
};
