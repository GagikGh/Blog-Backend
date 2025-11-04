'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.hasMany(models.Like, {
        foreignKey: 'postId',
        as: "like",
      });
      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
        as: "comments",
      })
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: "user"
      });

      Post.belongsToMany(models.Tag, {
        through: 'Post_Tags',
        as: "tags",
        foreignKey: 'postId',
        otherKey: 'tagId'
      });

    }
  }
  Post.init({
    title: DataTypes.STRING,
    createdAt: DataTypes.BIGINT,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }

  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'Posts',
    timestamps: false
  });
  return Post;
};
