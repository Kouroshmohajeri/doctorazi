import * as calendarRepository from '../repository/calendarRepository.js';

class CalendarController {
  async addCalendar(req, res) {
    const { doctor_id, date, time } = req.body;
    try {
      const calendar = await calendarRepository.addCalendar(doctor_id, date, time);
      res.status(201).json(calendar);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCalendarsByDoctorIdAndDate(req, res) {
    const { doctor_id } = req.params;
    const { date } = req.query;
    try {
        const calendars = await calendarRepository.getCalendarsByDoctorIdAndDate(doctor_id, date);
        res.json(calendars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }
  async getCalendarsByDoctorIdAndDateAndTime(req, res) {
    const { doctor_id } = req.params;
    const { date, time } = req.query;
    try {
        const calendars = await calendarRepository.getCalendarsByDoctorIdAndDateTime(doctor_id, date, time);
        res.json(calendars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }
  


  async updateCalendar(req, res) {
    const { calendar_id } = req.params;
    const { date, time, available } = req.body;
    try {
      const calendar = await calendarRepository.updateCalendar(calendar_id, date, time, available);
      res.json(calendar);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteCalendar(req, res) {
    const { calendar_id } = req.params;
    try {
      await calendarRepository.deleteCalendar(calendar_id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllCalendars(req, res) {
    try {
      const calendars = await calendarRepository.getAllCalendars();
      res.json(calendars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCalendarById(req, res) {
    const { calendar_id } = req.params;
    try {
      const calendar = await calendarRepository.getCalendarById(calendar_id);
      res.json(calendar);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCalendarsByDoctorId(req, res) {
    const { doctor_id } = req.params;
    try {
      const calendars = await calendarRepository.getCalendarsByDoctorId(doctor_id);
      res.json(calendars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCalendarsByDate(req, res) {
    const { date } = req.params;
    try {
      const calendars = await calendarRepository.getCalendarsByDate(date);
      res.json(calendars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCalendarsByTime(req, res) {
    const { time } = req.params;
    try {
      const calendars = await calendarRepository.getCalendarsByTime(time);
      res.json(calendars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CalendarController();
