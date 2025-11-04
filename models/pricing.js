'use strict';
import {Model} from "sequelize";
export default (sequelize, DataTypes) => {
  class Pricing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pricing.init({
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    status: DataTypes.STRING,
    priceId: DataTypes.STRING,
    stripeSubscriptionId: DataTypes.STRING,
    billing: DataTypes.STRING,
      description: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      features: {
          type: DataTypes.JSON, // store array like ["1 Project", "5GB Storage", ...]
          allowNull: false,
      },
  }, {
    sequelize,
    modelName: 'Pricing',
    tableName: 'pricing',
    timestamps: false,
  });
  return Pricing;
};