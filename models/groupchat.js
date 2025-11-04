'use strict';
import {Model} from "sequelize";
export default (sequelize, DataTypes) => {
  class GroupChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GroupChat.belongsTo(models.User, {
        foreignKey: "creatorId",
        as: "creator",
        onDelete: "CASCADE",
      })

      GroupChat.hasMany(models.Message, {
        foreignKey: "groupId",
        as: "messages",
        onDelete: "CASCADE",
      })

      GroupChat.hasMany(models.GroupMember, {
        foreignKey: "groupId",
        as: "groupMember",
        onDelete: "CASCADE",
      })

      GroupChat.belongsTo(models.Follow, {
        foreignKey: "followedId",
        as: "member",
      })
    }
  }
  GroupChat.init({
    name: DataTypes.STRING,
    creatorId: DataTypes.INTEGER,
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.ENUM('direct', 'group'),
      allowNull: false,
      defaultValue: 'direct',
    },
    createdAt: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'GroupChat',
    tableName: 'group_chats',
    timestamps: false,
  });
  return GroupChat;
};