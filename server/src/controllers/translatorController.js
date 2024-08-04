import * as translatorRepository from '../repository/translatorRepository.js';

export const createTranslator = async (req, res) => {
    try {
        const translator = await translatorRepository.createTranslator(req.body);
        res.status(201).json(translator);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTranslatorById = async (req, res) => {
    try {
        const translator = await translatorRepository.getTranslatorById(req.params.id);
        if (!translator) {
            return res.status(404).json({ message: 'Translator not found' });
        }
        res.json(translator);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getTranslatorByUserId = async (req, res) => {
    try {
        const translator = await translatorRepository.getTranslatorByUserId(req.params.userId);
        if (!translator) {
            return res.status(404).json({ message: 'Translator not found' });
        }
        res.json(translator);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllTranslators = async (req, res) => {
    try {
        const translators = await translatorRepository.getAllTranslators();
        res.json(translators);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTranslator = async (req, res) => {
    try {
        const updated = await translatorRepository.updateTranslator(req.params.id, req.body);
        if (updated[0] === 0) {
            return res.status(404).json({ message: 'Translator not found' });
        }
        res.json({ message: 'Translator updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTranslator = async (req, res) => {
    try {
        const deleted = await translatorRepository.deleteTranslator(req.params.id);
        if (deleted === 0) {
            return res.status(404).json({ message: 'Translator not found' });
        }
        res.json({ message: 'Translator deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
