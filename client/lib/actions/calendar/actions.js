import API from "@/app/api/server";
import dayjs from 'dayjs';

const BASE_URL = '/calendar';

// Function to handle errors and return an empty array
const handleErrors = (error) => {
    console.error("Error fetching calendar data:", error);
    return [];
}

// Action to add an event to the calendar
export const addEventToCalendar = async (eventData) => {
    try {
        // Format the date and time before sending the request
        const formattedData = {
            ...eventData,
            date: dayjs(eventData.date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            time: eventData.time,
        };

        const response = await API.post(`${BASE_URL}/add`, formattedData);
        return response.data; 
    } catch (error) {
        return handleErrors(error);
    }
};

export const getEventsByDoctorIdAndDate = async (doctorId, date) => {
    try {
        const response = await API.get(`${BASE_URL}/getByDoctorIdDate/${doctorId}`, {
            params: {
                date // Send date as a query parameter
            }
        });
        return response.data; 
    } catch (error) {
        return handleErrors(error);
    }
}

export const getEventsByDoctorIdAndDateAndTime = async (doctorId, date, time) => {
    try {
        const response = await API.get(`${BASE_URL}/getByDoctorIdDateTime/${doctorId}`, {
            params: {
                date,
                time
            }
        });
        return response.data; 
    } catch (error) {
        return handleErrors(error);
    }
}


// Action to update an event in the calendar
export const updateEventInCalendar = async (calendarId, updatedEventData) => {
    try {
        const response = await API.put(`${BASE_URL}/update/${calendarId}`, updatedEventData);
        return response.data; 
    } catch (error) {
        return handleErrors(error);
    }
}

// Action to delete an event from the calendar
export const deleteEventFromCalendar = async (calendarId) => {
    try {
        const response = await API.delete(`${BASE_URL}/delete/${calendarId}`);
        return response.data; 
    } catch (error) {
        return handleErrors(error);
    }
}

// Action to get all events from the calendar
export const getAllEventsFromCalendar = async () => {
    try {
        const response = await API.get(`${BASE_URL}/getAll`);
        return response.data; 
    } catch (error) {
        return handleErrors(error);
    }
}

// Action to get an event by its calendar ID
export const getEventByCalendarId = async (calendarId) => {
    try {
        const response = await API.get(`${BASE_URL}/getByCalendarId/${calendarId}`);
        return response.data; 
    } catch (error) {
        return handleErrors(error);
    }
}

// Action to get events by doctor ID
export const getEventsByDoctorId = async (doctorId) => {
    try {
        const response = await API.get(`${BASE_URL}/getByDoctorId/${doctorId}`);
        return response.data; 
    } catch (error) {
        return handleErrors(error);
    }
}

// Action to get events by date
export const getEventsByDate = async (date) => {
    try {
        const response = await API.get(`${BASE_URL}/getByDate/${date}`);
        return response.data; 
    } catch (error) {
        return handleErrors(error);
    }
}

// Action to get events by time
export const getEventsByTime = async (time) => {
    try {
        const response = await API.get(`${BASE_URL}/getByTime/${time}`);
        return response.data; 
    } catch (error) {
        return handleErrors(error);
    }
}
