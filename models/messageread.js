'use strict';
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class MessageRead extends Model {
    static associate(models) {
      MessageRead.belongsTo(models.User, {
        foreignKey: 'userId',
        as: "reader"
      });
      MessageRead.belongsTo(models.Message, {
        foreignKey: 'messageId',
        as: "message"
      });
    }
  }

  MessageRead.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    messageId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'MessageRead',
    tableName: 'message_reads',
    timestamps: false,
  });

  return MessageRead;
};
