import BiographyRepository from '../repository/biographyRepository.js';

class BiographyController {
  async add(req, res) {
    try {
      const { doctor_id, short_description, short_description_translated, long_description, long_description_translated, translatedName } = req.body;
      const biography = await BiographyRepository.addBiography(doctor_id, short_description, short_description_translated, long_description, long_description_translated, translatedName);
      res.status(201).json(biography);
    } catch (error) {
      console.error('Error creating biography:', error);
      res.status(500).json({ message: 'Error creating biography' });
    }
  }

  async update(req, res) {
    try {
      const { biography_id } = req.params;
      const { short_description, short_description_translated, long_description, long_description_translated, translatedName } = req.body;
      const updatedBiography = await BiographyRepository.updateBiography(biography_id, short_description, short_description_translated, long_description, long_description_translated, translatedName);
      res.json(updatedBiography);
    } catch (error) {
      console.error('Error updating biography:', error);
      res.status(500).json({ message: 'Error updating biography' });
    }
  }

  async getByDoctorId(req, res) {
    try {
      const { doctor_id } = req.params;
      const biography = await BiographyRepository.getBiographyByDoctorId(doctor_id);
      res.json(biography);
    } catch (error) {
      console.error('Error getting biography by doctor ID:', error);
      res.status(500).json({ message: 'Error getting biography by doctor ID' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await BiographyRepository.deleteBiography(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting biography:', error);
      res.status(500).json({ message: 'Error deleting biography' });
    }
  }

  async getAll(req, res) {
    try {
      const biographies = await BiographyRepository.getAllBiographies();
      res.json(biographies);
    } catch (error) {
      console.error('Error getting all biographies:', error);
      res.status(500).json({ message: 'Error getting all biographies' });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const biography = await BiographyRepository.getBiographyById(id);
      res.json(biography);
    } catch (error) {
      console.error('Error getting biography by ID:', error);
      res.status(500).json({ message: 'Error getting biography by ID' });
    }
  }
}

export default new BiographyController();
