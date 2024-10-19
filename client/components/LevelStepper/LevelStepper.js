"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Skeleton,
  Modal,
} from "@mui/material";
import styles from "./LevelStepper.module.css";
import { toISODateString } from "@/lib/toISOFormat";
import { createMeeting } from "@/lib/actions/zoom/actions";
import { createAppointment } from "@/lib/actions/appointments/actions";
import { AppointmentContext } from "@/context/AppointmentContex";
import { languageContext } from "@/context/LanguageContext";
import { UserDataContext } from "@/context/UserDatasContext";
import { getFullNameById } from "@/lib/actions/users/actions";
import { updateEventInCalendar } from "@/lib/actions/calendar/actions";
import { sideMenuContext } from "@/context/SideMenuContext";
import { useRouter } from "next/navigation";

export default function LevelStepper({ appointmentSteps, steps }) {
  const [activeStep, setActiveStep] = useState(0);
  const { doctor, setDoctor, setTime, setDate, speciality, setSpeciality, time, date, calendarId, setCalendarId } = useContext(AppointmentContext);
  const {currentLang} = useContext(languageContext);
  const {users,fetchCookies} = useContext(UserDataContext);
  const {setIsSelected} = useContext(sideMenuContext);
  const router = useRouter();

  useEffect(()=>{
    fetchCookies();
  },[])
  const skelton = (
    <Skeleton
      variant="rectangular"
      width={50}
      height={25}
      sx={{ borderRadius: "15px" }}
    />
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [accuracyChecked, setAccuracyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("doctorId") &&
      localStorage.getItem("appointmentDate") &&
      localStorage.getItem("appointmentTime")
    ) {
      setDate(localStorage.getItem("appointmentDate"));
      setTime(localStorage.getItem("appointmentTime"));
    }
  }, [setDate, setTime]);

  const handleNext = () => {
    if (activeStep === 0 && (!doctor.id || !speciality.id)) {
      setSnackbarMessage(
        !speciality.id ? "Please select a speciality." : "Please select a doctor."
      );
      setSnackbarOpen(true);
    } else if (activeStep === 1 && !date.gregorian) {
      setSnackbarMessage("Please select a date.");
      setSnackbarOpen(true);
    } else if (activeStep === 2 && !time) {
      setSnackbarMessage("Please select a time.");
      setSnackbarOpen(true);
    } else if (
      activeStep === 3 &&
      !(accuracyChecked && termsChecked)
    ) {
      setSnackbarMessage(
        "Please confirm all the details and accept the terms and conditions."
      );
      setSnackbarOpen(true);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePay = async () => {
    const fullName = await getFullNameById(users.id);
    const meetingDetails = {
      topic: `Consultation Appointment For ${fullName.fullName}`,
      start_time: `${date.gregorian}T${time}:00Z`,
      type: 2,
      duration: 30,
      timezone: "Asia/Tehran",
      agenda: `Consultation with ${doctor.name}`,
    };
    try {
      const zoomMeetingResponse = await createMeeting(meetingDetails);
      if (zoomMeetingResponse && zoomMeetingResponse.join_url) {
        const appointmentDetails = {
          client_id: users.id,
          physician_id: doctor.id,
          appointment_date: date.gregorian,
          appointment_time: time,
          status: "Pending",
          link: zoomMeetingResponse.join_url,
          host_link: zoomMeetingResponse.start_url,
        };

        const appointmentCreationResult = await createAppointment(
          appointmentDetails
        );
        await updateEventInCalendar(calendarId,{available:"false"})
        if (appointmentCreationResult.success) {

          setSnackbarMessage(
            "Appointment and Zoom meeting created successfully."
          );
          setSeverity("success");
          setSnackbarOpen(true);
        } else {
          throw new Error(
            appointmentCreationResult.error || "Failed to create appointment"
          );
        }
      } else {
        throw new Error("Zoom meeting creation did not return a join URL.");
      }
    } catch (error) {
      console.error(
        "Error during appointment or Zoom meeting creation:",
        error
      );
      setSnackbarMessage(
        error.message || "Failed to create appointment or Zoom meeting."
      );
      setSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setActiveStep(0);
      setAccuracyChecked(false);
      setTermsChecked(false);
      setIsSelected(1);
      router.push('/dashboard')
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenTermsModal = () => {
    setTermsModalOpen(true);
  };

  const handleCloseTermsModal = () => {
    setTermsModalOpen(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <div className={styles.lastCheck}>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Review and confirm your appointment details:
            </Typography>
            <Typography>
              Speciality: {speciality.name || skelton} <br />
              Doctor: {doctor.name || skelton} <br />
              Date: {currentLang==='en'?date.gregorian:date.jalali || skelton} <br />
              Time: {time || skelton}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={accuracyChecked}
                  onChange={(e) => setAccuracyChecked(e.target.checked)}
                />
              }
              label="I confirm the accuracy of the above information"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                />
              }
              label={
                <span>
                  I accept the{" "}
                  <span
                    onClick={handleOpenTermsModal}
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    terms and conditions
                  </span>
                </span>
              }
            />
            <div className={styles.buttons}>
              <Button
                variant="contained"
                disabled={!accuracyChecked || !termsChecked}
                onClick={handlePay}
              >
                Pay
              </Button>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div>
          {appointmentSteps[activeStep]}
          <div className={styles.skelton}>
            <span>
              Speciality
              <br />
              {speciality.name || skelton}
            </span>
            <span>
              Doctor
              <br />
              {doctor.name || skelton}
            </span>
            <span>
              Date
              <br />
              {currentLang==='en'?date.gregorian:date.jalali || skelton}
            </span>
            <span>
              Time
              <br />
              {time || skelton}
            </span>
          </div>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Modal
        open={termsModalOpen}
        onClose={handleCloseTermsModal}
        aria-labelledby="terms-and-conditions-modal"
        aria-describedby="terms-and-conditions-description"
      >
        <Box sx={{ padding: 4, backgroundColor: "white", borderRadius: 1, maxWidth: 600, margin: "auto", marginTop: "15%" }}>
          <Typography id="terms-and-conditions-modal" variant="h6" component="h2">
            Terms and Conditions
          </Typography>
          <Typography id="terms-and-conditions-description" sx={{ mt: 2 }}>
            Welcome to our health consultation service. By booking and attending a consultation, you agree to the following terms and conditions:
            <ul>
              <li>Each consultation is conducted via Zoom and is strictly limited to the scheduled time.</li>
              <li>The consultation is intended for the registered user who has paid the consultation fee. Sharing the meeting link is prohibited.</li>
              <li>If you exceed the allotted time, the consultation may be terminated without notice.</li>
              <li>Our consultations provide health advice based on the information you provide. We do not diagnose or treat medical conditions without a full medical examination.</li>
              <li>Payment for the consultation is non-refundable except in cases of cancellation by us.</li>
              <li>You must ensure a stable internet connection and a quiet environment for the consultation.</li>
              <li>Any abusive behavior or language during the consultation will result in immediate termination of the session without a refund.</li>
            </ul>
          </Typography>
          <Button onClick={handleCloseTermsModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
