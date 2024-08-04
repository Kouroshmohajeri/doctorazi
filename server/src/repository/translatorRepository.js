import Translator from '../models/Translator.js';
import User from '../models/User.js';

export const createTranslator = async (translatorData) => {
    return await Translator.create(translatorData);
};

export const getTranslatorById = async (translatorId) => {
    return await Translator.findByPk(translatorId);
};

export const getAllTranslators = async () => {
    return await Translator.findAll();
};

export const updateTranslator = async (translatorId, translatorData) => {
    return await Translator.update(translatorData, { where: { translatorId } });
};

export const deleteTranslator = async (translatorId) => {
    return await Translator.destroy({ where: { translatorId } });
};
export const getTranslatorByUserId = async (userId) => {
    return await Translator.findOne({
        where: { userId },
        include: [
            {
                model: User,
                attributes: ['first_name', 'last_name'],
            },
        ],
    });
};