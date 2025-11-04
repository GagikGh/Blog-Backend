'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: "sender",
        onDelete: "CASCADE",
      });
      Message.belongsTo(models.GroupChat, {
        foreignKey: 'groupId',
        as: "group",
        onDelete: "CASCADE",
      });
      Message.hasMany(models.MessageRead, {
        foreignKey: 'messageId',
        as: "redMessage",
      })
    }
  }
  Message.init({
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'GroupChats',
        key: 'id'
      },
      onDelete: 'CASCADE',
    },
    message: { type: DataTypes.STRING, allowNull: false },
    createdAt: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Messages',
    timestamps: false,
  });
  return Message;
};
