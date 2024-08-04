import * as translationsRepository from '../repository/translationsRepository.js';

export const createTranslation = async (req, res) => {
    try {
        const translation = await translationsRepository.createTranslation(req.body);
        res.status(201).json(translation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTranslationById = async (req, res) => {
    try {
        const translation = await translationsRepository.getTranslationById(req.params.id);
        if (!translation) {
            return res.status(404).json({ message: 'Translation not found' });
        }
        res.json(translation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllTranslations = async (req, res) => {
    try {
        const translations = await translationsRepository.getAllTranslations();
        res.json(translations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTranslation = async (req, res) => {
    try {
        const updated = await translationsRepository.updateTranslation(req.params.id, req.body);
        if (updated[0] === 0) {
            return res.status(404).json({ message: 'Translation not found' });
        }
        res.json({ message: 'Translation updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTranslation = async (req, res) => {
    try {
        const deleted = await translationsRepository.deleteTranslation(req.params.id);
        if (deleted === 0) {
            return res.status(404).json({ message: 'Translation not found' });
        }
        res.json({ message: 'Translation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
