import doctorRepository from '../repository/doctorRepository.js';

class DoctorController {
  async createDoctor(req, res) {
    try {
      const doctor = await doctorRepository.create(req.body);
      res.status(201).json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllDoctors(req, res) {
    try {
      const doctors = await doctorRepository.findAll();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDoctorByClientId(req, res) {
    try {
      const { clientId } = req.params; // Assuming user object is available in the request
      const doctorId = await doctorRepository.findDoctorIdByClientId(clientId);
      res.json({ doctorId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDoctorBySpecialityId(req, res) {
    try {
        const { id } = req.params; // Assuming id is the speciality ID
        const doctors = await doctorRepository.findBySpecialityId(id);
        res.json({ doctors });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }


  async getDoctor(req, res) {
    try {
      const { id } = req.params;
      const doctor = await doctorRepository.findById(id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateDoctor(req, res) {
    try {
      const { id } = req.params;
      const updatedDoctor = await doctorRepository.update(id, req.body);
      res.json(updatedDoctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async findPatientsByClientId(req, res) {
    try {
      const { clientId } = req.params;
      if (!clientId) {
        return res.status(400).json({ message: 'Client ID is required' });
      }
  
      // Retrieve patients based on clientId
      const patients = await doctorRepository.findPatientsByClientId(clientId);
  
      // Return patients
      res.json({ patients });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async removePatientFromClient(req, res) {
    try {
      const { clientId } = req.params;
      const { userId } = req.body;
      if (!clientId || !userId) {
        return res.status(400).json({ message: 'Client ID and User ID are required' });
      }
  
      // Call the repository method to remove the patient
      const result = await doctorRepository.removePatientByIdFromClient(clientId, userId);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async removePatientFromClient(req, res) {
    try {
      const { clientId } = req.params;
      const { userId } = req.body;
      if (!clientId || !userId) {
        return res.status(400).json({ message: 'Client ID and User ID are required' });
      }
  
      // Call the repository method to remove the patient
      const result = await doctorRepository.removePatientByIdFromClient(clientId, userId);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  

  async deleteDoctor(req, res) {
    try {
      const { id } = req.params;
      await doctorRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new DoctorController();
