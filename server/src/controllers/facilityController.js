import FacilityRepository from '../repository/facilityRepository.js';

class FacilityController {
  async add(req, res) {
    try {
      const { doctor_id, name, position } = req.body;
      const facility = await FacilityRepository.addFacility(doctor_id, name, position);
      res.status(201).json(facility);
    } catch (error) {
      console.error('Error creating facility:', error);
      res.status(500).json({ message: 'Error creating facility' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, position } = req.body;
      const updatedFacility = await FacilityRepository.updateFacility(id, name, position);
      res.json(updatedFacility);
    } catch (error) {
      console.error('Error updating facility:', error);
      res.status(500).json({ message: 'Error updating facility' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await FacilityRepository.deleteFacility(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting facility:', error);
      res.status(500).json({ message: 'Error deleting facility' });
    }
  }

  async getAll(req, res) {
    try {
      const facilities = await FacilityRepository.getAllFacilities();
      res.json(facilities);
    } catch (error) {
      console.error('Error getting all facilities:', error);
      res.status(500).json({ message: 'Error getting all facilities' });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const facility = await FacilityRepository.getFacilityById(id);
      res.json(facility);
    } catch (error) {
      console.error('Error getting facility by ID:', error);
      res.status(500).json({ message: 'Error getting facility by ID' });
    }
  }

  async getByDoctorId(req, res) {
    try {
      const { doctor_id } = req.params;
      const facilities = await FacilityRepository.getByDoctorId(doctor_id);
      res.json(facilities);
    } catch (error) {
      console.error('Error getting facilities by doctor ID:', error);
      res.status(500).json({ message: 'Error getting facilities by doctor ID' });
    }
  }
  
}



export default new FacilityController();
