import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import BlogPosts from './BlogPosts.js';

const Translations = sequelize.define('Translations', {
    translationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    blogPostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: BlogPosts,
            key: 'post_id',
        },
    },
    isRejected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    headId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    originalAuthorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Translations',
    timestamps: true,
});

BlogPosts.hasMany(Translations, { foreignKey: 'blogPostId' });
Translations.belongsTo(BlogPosts, { foreignKey: 'blogPostId' });

export default Translations;
