import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

class DoctorRepository {
  async create(doctorData) {
    try {
      return await Doctor.create(doctorData);
    } catch (error) {
      throw new Error('Error creating doctor');
    }
  }

  async findAll() {
    try {
      return await Doctor.findAll();
    } catch (error) {
      throw new Error('Error finding doctors');
    }
  }

  async findById(id) {
    try {
      return await Doctor.findByPk(id);
    } catch (error) {
      throw new Error('Error finding doctor');
    }
  }

  async findDoctorIdByClientId(clientId) {
    try {
      const doctor = await Doctor.findOne({ where: { client_id: clientId }, attributes: ['doctor_id'] });
      if (!doctor) {
        throw new Error('Doctor not found for the given client ID');
      }
      return doctor.doctor_id;
    } catch (error) {
      throw new Error('Error finding doctor ID by client ID: ' + error.message);
    }
  }
  async findPatientsByClientId(clientId) {
    try {
        const doctor = await Doctor.findOne({
            where: { client_id: clientId },
            attributes: ['patients'] 
        });
        if (!doctor) {
            throw new Error('Doctor not found for the given client ID');
        }
        const patients = doctor.patients ? doctor.patients.split(',').map(Number) : [];
        return patients;
    } catch (error) {
        throw new Error('Error finding patients by client ID: ' + error.message);
    }
  }

  async removePatientByIdFromClient(clientId, userId) {
    try {
      const doctor = await Doctor.findOne({ where: { client_id: clientId } });
      if (!doctor) {
        throw new Error('Doctor not found for the given client ID');
      }
      
      // Split patients list and convert to array of numbers
      const patients = doctor.patients ? doctor.patients.split(',').map(Number) : [];
      
      // Find index of user ID in the patients list
      const index = patients.indexOf(userId);
      if (index === -1) {
        throw new Error('User not found in the patient list');
      }

      // Remove user ID from patients list
      patients.splice(index, 1);
      
      // Update patients list in the Doctor model
      await Doctor.update({ patients: patients.join(',') }, { where: { client_id: clientId } });

      return { message: 'User removed from the patient list successfully' };
    } catch (error) {
      throw new Error('Error removing patient from client: ' + error.message);
    }
  }

  async update(id, doctorData) {
    try {
      let doctor = await Doctor.findByPk(id);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      doctor = await doctor.update(doctorData);
      return doctor;
    } catch (error) {
      throw new Error('Error updating doctor');
    }
  }

  async delete(id) {
    try {
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      await doctor.destroy();
    } catch (error) {
      throw new Error('Error deleting doctor');
    }
  }

  async findBySpecialityId (specialityId) {
    try {
        const doctors = await Doctor.findAll({
            where: { speciality_id: specialityId },
            include: [{
                model: User,
                as: 'ClientDetails',
                attributes: ['first_name', 'last_name']
            }]
        });
        if (!doctors.length) {
            throw new Error('No doctors found for the given speciality ID');
        }
        return doctors;
    } catch (error) {
        throw new Error('Error finding doctors by speciality ID: ' + error.message);
    }
}

}

export default new DoctorRepository();
