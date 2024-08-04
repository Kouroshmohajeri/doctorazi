import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Translator = sequelize.define('Translator', {
    translatorId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
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
    tableName: 'Translator',
    timestamps: true,
});

User.hasMany(Translator, { foreignKey: 'userId' });
Translator.belongsTo(User, { foreignKey: 'userId' });

export default Translator;
