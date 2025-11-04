'use strict';
import {
  Model
} from 'sequelize';
export default (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tag.belongsToMany(models.Post, {
        through: 'Post_Tags',
        as: "posts",
        foreignKey: 'tagId',
        otherKey: 'postId'
      });
    }
  }
  Tag.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    color: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    slug: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Tag',
    tableName: 'Tags',
    timestamps: false,
  });
  return Tag;
};