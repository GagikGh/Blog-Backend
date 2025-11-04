'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Follow.belongsTo(models.User, {
        foreignKey: 'followerId',
        onDelete: 'CASCADE',
        as: 'follower'
      });
      Follow.belongsTo(models.User, {
        foreignKey: 'followedId',
        onDelete: 'CASCADE',
        as: 'followed'
      });
      Follow.hasMany(models.GroupChat, {
        foreignKey: 'creatorId',
        as: 'groups'
      })
    }
  }
  Follow.init({
    followerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    followedId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'Follow',
    tableName: 'Follows',
    timestamps: false,
  });
  return Follow;
};