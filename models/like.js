'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Like.belongsTo(models.Comment, {
        foreignKey: 'commentId',
        as: 'comment',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Like.belongsTo(models.Post, {
        foreignKey: 'postId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Like.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

    }
  }
  Like.init({
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Posts',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    timestamps: false,
  });
  return Like;
};
