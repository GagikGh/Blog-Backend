'use strict';
import {
  Model
} from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: "userId" });
      User.hasMany(models.Follow, { foreignKey: "followerId", as: "follower" });
      User.hasMany(models.Follow, { foreignKey: "followedId", as: "followed" });
      User.hasMany(models.Message, { foreignKey: "senderId", as: "sender" });
      User.hasMany(models.GroupChat, { foreignKey: "creatorId", as: "creator" });
      User.hasMany(models.GroupMember, { foreignKey: "userId", as: "user" });
      User.hasMany(models.MessageRead, { foreignKey: "userId", as: "readerMessage" });
      User.hasMany(models.Order, { foreignKey: "userId", as: "orderReceiver" });
      User.hasMany(models.Subscription, { foreignKey: "userId", as: "customer" });
    }
  }
  User.init({
    firstName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    slug: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    notificationMessages: {
      allowNull: false,
      type: DataTypes.STRING
    },
    stripeCustomerId: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: false,
  });
  return User;
};
