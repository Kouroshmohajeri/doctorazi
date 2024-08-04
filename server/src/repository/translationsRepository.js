import Translation from '../models/Translation.js';

export const createTranslation = async (translationData) => {
    return await Translation.create(translationData);
};

export const getTranslationById = async (translationId) => {
    return await Translation.findByPk(translationId);
};

export const getAllTranslations = async () => {
    return await Translation.findAll();
};

export const updateTranslation = async (translationId, translationData) => {
    return await Translation.update(translationData, { where: { translationId } });
};

export const deleteTranslation = async (translationId) => {
    return await Translation.destroy({ where: { translationId } });
};
