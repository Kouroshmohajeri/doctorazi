import Biography from '../models/Biography.js';

class BiographyRepository {
  async addBiography(doctor_id, short_description, short_description_translated, long_description, long_description_translated, translatedName) {
    try {
      const biography = await Biography.create({
        doctor_id,
        short_description,
        short_description_translated,
        long_description,
        long_description_translated,
        translatedName,
      });
      return biography;
    } catch (error) {
      throw new Error('Error creating biography: ' + error.message);
    }
  }

  async getBiographyByDoctorId(doctor_id) {
    try {
      const biography = await Biography.findOne({
        where: { doctor_id }
      });
      return biography;
    } catch (error) {
      throw new Error('Error getting biography by doctor ID: ' + error.message);
    }
  }

  async updateBiography(biography_id, short_description, short_description_translated, long_description, long_description_translated, translatedName) {
    try {
      const biography = await Biography.findByPk(biography_id);
      if (biography) {
        biography.short_description = short_description;
        biography.short_description_translated = short_description_translated;
        biography.long_description = long_description;
        biography.long_description_translated = long_description_translated;
        biography.translatedName = translatedName;
        await biography.save();
        return biography;
      }
      return null;
    } catch (error) {
      throw new Error('Error updating biography: ' + error.message);
    }
  }

  async deleteBiography(biography_id) {
    try {
      const deleted = await Biography.destroy({
        where: { biography_id },
      });
      return deleted;
    } catch (error) {
      throw new Error('Error deleting biography: ' + error.message);
    }
  }

  async getAllBiographies() {
    try {
      const biographies = await Biography.findAll();
      return biographies;
    } catch (error) {
      throw new Error('Error getting all biographies: ' + error.message);
    }
  }

  async getBiographyById(biography_id) {
    try {
      const biography = await Biography.findByPk(biography_id);
      return biography;
    } catch (error) {
      throw new Error('Error getting biography by ID: ' + error.message);
    }
  }
}

export default new BiographyRepository();
