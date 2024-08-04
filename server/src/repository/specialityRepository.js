// SpecialityRepository
import Speciality from '../models/Speciality.js';

class SpecialityRepository {
    async createSpeciality(name, translate) {
        try {
            const speciality = await Speciality.create({ name, translate });
            return speciality;
        } catch (error) {
            throw new Error('Error creating Speciality: ' + error.message);
        }
    }

    async findById(id) {
        try {
            const speciality = await Speciality.findByPk(id);
            return speciality;
        } catch (error) {
            throw new Error('Error finding Speciality: ' + error.message);
        }
    }

    async listSpecialities() {
        try {
            const specialities = await Speciality.findAll();
            return specialities;
        } catch (error) {
            throw new Error('Error listing Specialities: ' + error.message);
        }
    }

    async updateSpeciality(id, name, translate) {
        try {
            const speciality = await Speciality.findByPk(id);
            if (speciality) {
                speciality.name = name;
                speciality.translate = translate; // Update translation
                await speciality.save();
                return speciality;
            }
            return null;
        } catch (error) {
            throw new Error('Error updating Speciality: ' + error.message);
        }
    }

    async deleteSpeciality(id) {
        try {
            const deleted = await Speciality.destroy({
                where: { speciality_id: id }
            });
            return deleted;
        } catch (error) {
            throw new Error('Error deleting Speciality: ' + error.message);
        }
    }
}

export default new SpecialityRepository();
