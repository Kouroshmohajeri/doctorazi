// SpecialityController
import SpecialityRepository from '../repository/specialityRepository.js';

class SpecialityController {
    async create(req, res) {
        try {
            const { name, translate } = req.body;
            const speciality = await SpecialityRepository.createSpeciality(name, translate);
            res.status(201).json(speciality);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async get(req, res) {
        try {
            const { id } = req.params;
            const speciality = await SpecialityRepository.findById(id);
            if (speciality) {
                res.json(speciality);
            } else {
                res.status(404).json({ message: 'Speciality not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async list(req, res) {
        try {
            const specialities = await SpecialityRepository.listSpecialities();
            res.json(specialities);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, translate } = req.body;
            const updatedSpeciality = await SpecialityRepository.updateSpeciality(id, name, translate);
            if (updatedSpeciality) {
                res.json(updatedSpeciality);
            } else {
                res.status(404).json({ message: 'Speciality not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await SpecialityRepository.deleteSpeciality(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Speciality not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Method to get the translation of a Speciality by ID
    async getTranslation(req, res) {
        try {
            const { id } = req.params;
            const speciality = await SpecialityRepository.findById(id);
            if (speciality) {
                res.json({ translation: speciality.translate });
            } else {
                res.status(404).json({ message: 'Speciality not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Method to get the original form of a Speciality by ID
    async getOriginal(req, res) {
        try {
            const { id } = req.params;
            const speciality = await SpecialityRepository.findById(id);
            if (speciality) {
                res.json({ original: speciality.name });
            } else {
                res.status(404).json({ message: 'Speciality not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Method to get both original and translated form of a Speciality by ID
    async getBothForms(req, res) {
        try {
            const { id } = req.params;
            const speciality = await SpecialityRepository.findById(id);
            if (speciality) {
                res.json({ original: speciality.name, translation: speciality.translate });
            } else {
                res.status(404).json({ message: 'Speciality not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new SpecialityController();
