// controllers/appointmentController.js
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import appointmentRepository from '../repository/appointmentRepository.js';

class AppointmentController {
  async createAppointment(req, res) {
    try {
      const {client_id,physician_id,appointment_date,appointment_time,status,link,host_link} = req.body
      const appointment = await appointmentRepository.create(
        {client_id,
        physician_id,
        appointment_date,
        appointment_time,
        status,
        link,
        host_link
      }
      );
      res.status(201).json(appointment);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  }

  // Get appointments by client ID
  async getAppointmentsByClient(req, res) {
    try {
      const { clientId } = req.params;
      const appointments = await appointmentRepository.findByClientId(clientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching appointments for client: ' + error.message });
    }
  }

  // Get appointments by physician ID
  async getAppointmentsByPhysicianId(req, res) {
    const { physicianId } = req.params;
    try {
      const appointments = await appointmentRepository.findAll({
        where: { physician_id: physicianId }
      });
  
      return res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments by physician ID:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  



  async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const appointmentData = req.body; 
      const appointment = await appointmentRepository.update(id, appointmentData);
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  

  async deleteAppointment(req, res) {
    try {
      const { id } = req.params;
      await appointmentRepository.delete(id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllAppointments(req, res) {
    try {
      const appointments = await appointmentRepository.findAll();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async getAppointment(req, res) {
    try {
      const { id } = req.params;
      const appointment = await appointmentRepository.findById(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

export default AppointmentController;
