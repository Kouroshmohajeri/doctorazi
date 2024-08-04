import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js'
import User from '../models/User.js';

class AppointmentRepository {
  async create(appointmentData) {
    try {
      return await Appointment.create(appointmentData);
    } catch (error) {
      console.log(error)
      throw new Error('Error creating appointment');
    }
  }

  async update(appointmentId, appointmentData) {
    try {
      const appointment = await Appointment.findByPk(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      return await appointment.update(appointmentData);
    } catch (error) {
      console.log(error)
      throw new Error('Error updating appointment');
    }
  }  

  async delete(appointmentId) {
    try {
      const appointment = await Appointment.findByPk(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      await appointment.destroy();
    } catch (error) {
      throw new Error('Error deleting appointment');
    }
  }

  async findAll() {
    try {
      return await Appointment.findAll({
        include: [
          {
            model: Doctor,
            as: 'Physician',
            include: [{ // Nested include for User model
              model: User,
              as: 'ClientDetails',
              attributes: ['first_name', 'last_name'],
            }],
          },
          {
            model: User,
            as: 'Client',
            attributes: ['first_name', 'last_name'],
          }
        ],
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching all appointments');
    }
  }
  
  // Find appointments by client ID
  async findByClientId(clientId) {
    return await Appointment.findAll({
      where: { client_id: clientId },
      include: [
        {
          model: Doctor,
          as: 'Physician',
          include: {
            model: User,
            as: 'ClientDetails',
            attributes: ['first_name', 'last_name'],
          }
        },
        {
          model: User,
          as: 'Client',
          attributes: ['first_name', 'last_name'],
        }
      ]
    });
  }

  // Find appointments by physician ID
  async findByPhysicianId(physicianId) {
    return await Appointment.findAll({
      where: { physician_id: physicianId },
      include: [
        {
          model: Doctor,
          as: 'Physician',
          include: {
            model: User,
            as: 'ClientDetails',
            attributes: ['first_name', 'last_name'],
          }
        },
        {
          model: User,
          as: 'Client',
          attributes: ['first_name', 'last_name'],
        }
      ]
    });
  }


  async findById(appointmentId) {
    try {
      return await Appointment.findByPk(appointmentId);
    } catch (error) {
      throw new Error('Error finding appointment');
    }
  }

}

export default new AppointmentRepository();
