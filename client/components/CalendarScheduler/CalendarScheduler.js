'use client';
import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserDataContext } from '@/context/UserDatasContext';
import { ClinicalRecordContext } from '@/context/ClinicalRecordContext';
import { getDoctorByClientId } from '@/lib/actions/doctors/actions';
import { getEventsByDoctorId, deleteEventFromCalendar } from '@/lib/actions/calendar/actions'; // Import the function to delete an event
import MyModal from '../MyModal/MyModal';


const CalendarScheduler = () => {
  const { users, fetchCookies } = useContext(UserDataContext);
  const { refresh, setRefresh } = useContext(ClinicalRecordContext);
  const [doctorId, setDoctorId] = useState(0);
  const [calendarApi, setCalendarApi] = useState(null); // Reference to calendar API
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Track selected event
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCookies();
  }, []);

  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const doctorData = await getDoctorByClientId(users.id);
        setDoctorId(doctorData.doctorId);
      } catch (error) {
        console.error('Error fetching doctor ID:', error.message);
      }
    };
    fetchDoctorId();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await getEventsByDoctorId(doctorId);
        const formattedEvents = eventData.map(event => ({
          title: event.available==='true' ? 'Free' : 'Taken',
          start: `${event.date}T${event.time}:00`, // Combine date and time
          id: event.calendar_id, // Set event ID
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error.message);
      }
    };
    
    if (doctorId !== 0) {
      fetchEvents();
    }
  }, [doctorId, refresh]);

  const handleEventClick = (clickInfo) => {
    // Set selected event when an event is clicked
    setSelectedEvent(clickInfo.event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close modal and reset selected event
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEventFromCalendar(eventId);
      setRefresh(refresh + 1); // Trigger refresh of events
      setIsModalOpen(false); // Close modal after deleting event
    } catch (error) {
      console.error('Error deleting event:', error.message);
    }
  };

  const handleCalendarReady = (calendar) => {
    setCalendarApi(calendar);
  };

  return (
    <div>
      <MyModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this appointment?"
      />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={handleEventClick} // Add eventClick callback
        ref={handleCalendarReady} // Reference to the calendar API
      />
    </div>
  );
};

export default CalendarScheduler;
