import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Translator from './Translator.js';

const BlogPosts = sequelize.define(
  'BlogPosts',
  {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING(155),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    altName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isRejected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isTranslated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    headId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    translatedTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    translatedShortDescription: {
      type: DataTypes.STRING(155),
      allowNull: true,
    },
    translatedContent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    translatorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Translator,
        key: 'translatorId',
      },
    },
  },
  {
    tableName: 'BlogPosts',
    timestamps: true,
  }
);

User.hasMany(BlogPosts, { foreignKey: 'author_id' });
BlogPosts.belongsTo(User, { foreignKey: 'author_id', as: 'Author' });

export default BlogPosts;
