'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Subscription.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'subscription',
      })
    }
  }
  Subscription.init({
    userId: {
      type: DataTypes.INTEGER,
    },
    pricingId: {
      type: DataTypes.INTEGER,
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    period: {
      type: DataTypes.STRING,
    },
    currentPeriodStart: {
      allowNull: false,
      type: DataTypes.DATE
    },
    currentPeriodEnd: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Subscription',
    tableName: 'subscriptions',
    timestamps: false,
  });
  return Subscription;
};
