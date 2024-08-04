import Calendar from '../models/Calendar.js';

export const addCalendar = async (doctor_id, date, time) => {
  try {
    return await Calendar.create({ doctor_id, date, time, available:'true' });
  } catch (error) {
    throw new Error('Error adding calendar');
  }
};

export const updateCalendar = async (calendar_id, date, time, available) => {
  console.log(calendar_id, date, time, available)
  try {
    const calendar = await Calendar.findByPk(calendar_id);
    if (!calendar) throw new Error('Calendar not found');
    // calendar.date = date;
    // calendar.time = time;
    calendar.available = available;
    return await calendar.save();
  } catch (error) {
    throw new Error('Error updating calendar');
  }
};

export const getCalendarsByDoctorIdAndDate = async (doctor_id, date) => {
  try {
      return await Calendar.findAll({ 
          where: { 
              doctor_id,
              date
          } 
      });
  } catch (error) {
      throw new Error(error);
  }
};

export const getCalendarsByDoctorIdAndDateTime = async (doctor_id, date, time) => {
  try {
      return await Calendar.findOne({ 
          where: { 
              doctor_id,
              date,
              time
          } 
      });
  } catch (error) {
      throw new Error(error);
  }
};



export const deleteCalendar = async (calendar_id) => {
  try {
    const calendar = await Calendar.findByPk(calendar_id);
    if (!calendar) throw new Error('Calendar not found');
    await calendar.destroy();
  } catch (error) {
    throw new Error('Error deleting calendar');
  }
};

export const getAllCalendars = async () => {
  try {
    return await Calendar.findAll();
  } catch (error) {
    throw new Error('Error getting all calendars');
  }
};

export const getCalendarById = async (calendar_id) => {
  try {
    return await Calendar.findByPk(calendar_id);
  } catch (error) {
    throw new Error('Error getting calendar by ID');
  }
};

export const getCalendarsByDoctorId = async (doctor_id) => {
  try {
    return await Calendar.findAll({ where: { doctor_id } });
  } catch (error) {
    throw new Error('Error getting calendars by doctor ID');
  }
};

export const getCalendarsByDate = async (date) => {
  try {
    return await Calendar.findAll({ where: { date } });
  } catch (error) {
    throw new Error('Error getting calendars by date');
  }
};

export const getCalendarsByTime = async (time) => {
  try {
    return await Calendar.findAll({ where: { time } });
  } catch (error) {
    throw new Error('Error getting calendars by time');
  }
};
