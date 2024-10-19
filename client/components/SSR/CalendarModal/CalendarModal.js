"use client";
import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { getEventsByDoctorId } from "@/lib/actions/calendar/actions";
import { ClinicalRecordContext } from "@/context/ClinicalRecordContext";
import { useRouter } from "next/navigation";
import { UserDataContext } from "@/context/UserDatasContext";


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxHeight: "80%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "15px",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
};

export default function CalendarModal({ open, setOpen, id }) {
    const router = useRouter();
    const { refresh, setRefresh } = useContext(ClinicalRecordContext);
    const {users,fetchCookies} = useContext(UserDataContext);
    const [events, setEvents] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const handleClose = () => setOpen(false);

    

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getEventsByDoctorId(id);
                const groupedEvents = response.reduce((acc, event) => {
                    const date = event.date;
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push({ time: event.time, available: event.available });
                    return acc;
                }, {});

                // Sort the times within each date
                Object.keys(groupedEvents).forEach((date) => {
                    groupedEvents[date].sort((a, b) => a.time.localeCompare(b.time));
                });

                setEvents(groupedEvents);
            } catch (error) {
                setSnackbarSeverity("error");
                setSnackbarMessage("Failed to fetch events.");
                setSnackbarOpen(true);
            }
        };
        fetchEvents();
    }, [refresh, id]);

    const handleTimeClick = (event, date) => {
        if (event.available === "true") {
            localStorage.removeItem("doctorId")
            localStorage.removeItem("appointmentDate")
            localStorage.removeItem("appointmentTime")
            localStorage.setItem("doctorId",id)
            localStorage.setItem("appointmentDate",date)
            localStorage.setItem("appointmentTime",event.time)
            router.push('/appointment')
        } else {
            // Show error snackbar
            setSnackbarSeverity("error");
            setSnackbarMessage("This time slot is not available.");
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };
    
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                {
                    users?.id&&localStorage.getItem("calendar")/8312===users.id?
                
                    <Grid container spacing={2}>
                        {Object.keys(events).map((date) => (
                            <Grid item xs={6} key={date}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ textAlign: "center" }}
                                >
                                    {date}
                                </Typography>
                                {events[date].map((event, index) => (
                                    <Paper
                                        key={index}
                                        elevation={3}
                                        sx={{
                                            marginBottom: 1,
                                            padding: 1,
                                            textAlign: "center",
                                            backgroundColor:
                                                event.available === "true" ? "#008000" : "#FF0000",
                                            cursor:
                                                event.available === "true" ? "pointer" : "not-allowed",
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "white" }}
                                            onClick={() => {
                                                handleTimeClick(event, date);
                                            }}
                                        >
                                            {event.time}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Grid>
                        ))}
                    </Grid>
                    :
                    <div className="text-center">
                        <h3>Login to see the available spots</h3>
                        <button className="btn btn-primary" onClick={()=>{router.push('/login')}}>Login</button>
                    </div>
                }
                </Box>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
