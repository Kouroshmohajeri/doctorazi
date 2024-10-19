import React, { useContext, useEffect, useState } from 'react';
import { TimePicker, Button, Select, MenuItem, FormControl, InputLabel, Grid, Snackbar, Backdrop, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { addEventToCalendar, getEventsByDoctorIdAndDate } from '@/lib/actions/calendar/actions';
import { UserDataContext } from '@/context/UserDatasContext';
import { getDoctorByClientId } from '@/lib/actions/doctors/actions';
import styles from './DoctorCalendar.module.css';
import CalendarScheduler from '../CalendarScheduler/CalendarScheduler';
import { ClinicalRecordContext } from '@/context/ClinicalRecordContext';

const DoctorCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const { refresh, setRefresh } = useContext(ClinicalRecordContext);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [availableHours, setAvailableHours] = useState([]);
  const { users, fetchCookies } = useContext(UserDataContext);
  const [doctorId, setDoctorId] = useState(0);

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
  }, [users.id]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedHours({});
    setErrorMessages({});
  
    try {
      const events = await getEventsByDoctorIdAndDate(doctorId, date.format('YYYY-MM-DD'));
  
      // Extract available hours from the events array
      const takenTimes = events.map(event => event.time);
      const availableTimes = [...Array(24).keys()].map(hour => {
        const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        return formattedHour;
      }).filter(time => !takenTimes.includes(time));
  
      setAvailableHours(availableTimes);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };
  

  const handleAddHourSlot = () => {
    setSelectedHours({
      ...selectedHours,
      [selectedDate]: selectedHours[selectedDate] ? [...selectedHours[selectedDate], ''] : [''], // Add an empty string for the new slot
    });
  };
  

  const handleHourChange = (date, index, hour) => {
    const newSelectedHours = { ...selectedHours };
    newSelectedHours[date][index] = hour;
    setSelectedHours(newSelectedHours);

    // Remove the error message for this slot if it exists
    const errorMessageKey = `${date}-${index}`;
    if (errorMessages[errorMessageKey]) {
      const newErrorMessages = { ...errorMessages };
      delete newErrorMessages[errorMessageKey];
      setErrorMessages(newErrorMessages);
    }
  };

  const handleRemoveHourSlot = (date, index) => {
    const newSelectedHours = { ...selectedHours };
    newSelectedHours[date].splice(index, 1);
    setSelectedHours(newSelectedHours);
  };

  const handleSave = async () => {
    const data = [];
    const duplicateCheck = {};
    const newErrorMessages = {};

    Object.entries(selectedHours).forEach(([date, hours]) => {
      hours.forEach((hour, index) => {
        // Check for empty or null date and time
        if (!date || !hour) {
          newErrorMessages[`${date}-${index}`] = 'Please select a valid time.';
          return;
        }

        // Check for duplicate date and time
        const dateTimeKey = `${date}-${hour}`;
        if (duplicateCheck[dateTimeKey]) {
          newErrorMessages[`${date}-${index}`] = 'Duplicate date and time.';
          return;
        }

        // Format date as dd/mm/yyyy
        const formattedDate = dayjs(date).format('DD/MM/YYYY');
        data.push({ date: formattedDate, time: hour });
        duplicateCheck[dateTimeKey] = true;
      });
    });

    if (Object.keys(newErrorMessages).length > 0) {
      // Update error messages state
      setErrorMessages(newErrorMessages);
      return;
    }

    setLoading(true); // Set loading to true to disable buttons
    // Insert each event in selectedData into the database
    try {
      await Promise.all(data.map(async (event) => {
        // Pass doctorId to the addEventToCalendar action
        await addEventToCalendar({ ...event, doctor_id: doctorId });
      }));
      setSuccessSnackbarOpen(true);
    } catch (error) {
      console.error('Error inserting event:', error);
      setErrorSnackbarOpen(true);
    } finally {
      setLoading(false); // Set loading to false to enable buttons
      // Reset selected data and error messages
      setSelectedHours({});
      setSelectedDate(null);
      setErrorMessages({});
      setRefresh(!refresh)
    }
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessSnackbarOpen(false);
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  const today = dayjs();
  const disablePastDates = (date) => {
    return date.isBefore(today, 'day');
  };

  return (
    <div className={styles.calendar}>
    <Grid container spacing={2}>
      {/* Left side: DatePicker */}
      <Grid item xs={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            fullWidth
            shouldDisableDate={disablePastDates} // Disable past dates
          />
        </LocalizationProvider>
      </Grid>
      {/* Right side: Slots */}
      <Grid item xs={6}>
        {selectedDate && (
          <>
            {selectedHours[selectedDate]?.map((hour, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={8}>
                  <FormControl fullWidth>
                    <InputLabel>Select Hour</InputLabel>
                    <Select
                      value={hour}
                      onChange={(e) => handleHourChange(selectedDate, index, e.target.value)}
                      error={!!errorMessages[`${selectedDate}-${index}`]}
                      disabled={loading} // Disable select while loading
                    >
                      {availableHours.map((hourOption) => (
                        <MenuItem key={hourOption} value={hourOption}>
                          {hourOption}
                        </MenuItem>
                      ))}
                    </Select>
                    {errorMessages[`${selectedDate}-${index}`] && (
                      <div className="text-danger">
                        {errorMessages[`${selectedDate}-${index}`]}
                      </div>
                    )}
                    <br/>
                  </FormControl>
                  <br/>
                </Grid>
                <Grid item xs={4}>
                  <Button onClick={() => handleRemoveHourSlot(selectedDate, index)} disabled={loading}>Remove</Button>
                </Grid>
              </Grid>
            ))}
            <Button onClick={handleAddHourSlot} disabled={loading}>+ Add time</Button>
          </>
        )}
      </Grid>
      {/* Save button */}
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={!selectedDate || loading}>
          Save
        </Button>
      </Grid>
      {/* Snackbar for success */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSuccessSnackbar}
        message="Added to your calendar successfully!"
      />
      {/* Snackbar for error */}
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
        message="Something went wrong!"
        severity="error"
      />
      {/* Backdrop to disable buttons while loading */}
      <Backdrop open={loading} style={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
    <br/>
    <br/>
    <CalendarScheduler/>
    </div>
  );
};

export default DoctorCalendar;
