'use strict';
import {Model} from "sequelize";
export default (sequelize, DataTypes) => {
  class GroupMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GroupMember.belongsTo(models.GroupChat, {
        foreignKey: "groupId",
        as: "groupMember",
        onDelete: "CASCADE",
      })

      GroupMember.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      })
    }
  }
  GroupMember.init({
    groupId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    role: {
      type: DataTypes.ENUM('Admin', 'Chat'),
      allowNull: false,
      defaultValue: 'Chat'
    },
    joinedAt: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
  }, {
    sequelize,
    modelName: 'GroupMember',
    tableName: 'group_members',
    timestamps: false,
  });
  return GroupMember;
};