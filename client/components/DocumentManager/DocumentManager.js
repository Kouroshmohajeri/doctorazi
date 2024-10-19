import React, { useContext, useEffect, useState } from "react";
import { Tabs, Tab, Box, TextField, Button, Snackbar, Alert } from "@mui/material";
import { updateDocument, getDocumentById } from "@/lib/actions/documents/actions"; 
import { UserDataContext } from "@/context/UserDatasContext";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function DocumentsManager() {
    const { users, fetchCookies } = useContext(UserDataContext);
    useEffect(() => {
        fetchCookies();
    }, []);

    const [value, setValue] = useState(0);
    const [text, setText] = useState({
        termsAndConditions: { en: "", fa: "" },
        aboutUs: { en: "", fa: "" },
        contactUs: { en: "", fa: "" },
        privacyPolicy: { en: "", fa: "" },
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const document = await getDocumentById(1); 
                if (document) {
                    setText({
                        termsAndConditions: { en: document.termsAndConditionsEnglish || "", fa: document.termsAndConditionsFarsi || "" },
                        aboutUs: { en: document.aboutUsEnglish || "", fa: document.aboutUsFarsi || "" },
                        contactUs: { en: document.contactUsEnglish || "", fa: document.contactUsFarsi || "" },
                        privacyPolicy: { en: document.privacyPolicyEnglish || "", fa: document.privacyPolicyFarsi || "" },
                    });
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        const [field, language] = name.split("_");
        setText((prevState) => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                [language]: value,
            },
        }));
    };

    const handleSubmit = async (tab) => {
        try {
            const updates = {
                [`${tab}English`]: text[tab].en,
                [`${tab}Farsi`]: text[tab].fa,
            };
            await updateDocument(1, updates);
            setSnackbarMessage(`Submitted text for ${tab} successfully.`);
            setSnackbarSeverity("success");
        } catch (error) {
            console.error(`Error submitting text for ${tab}:`, error);
            setSnackbarMessage(`Error submitting text for ${tab}.`);
            setSnackbarSeverity("error");
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="documents manager tabs"
                >
                    <Tab label="Terms and Conditions" {...a11yProps(0)} />
                    <Tab label="About Us" {...a11yProps(1)} />
                    <Tab label="Contact Us" {...a11yProps(2)} />
                    <Tab label="Policy" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <TextField
                    label="Write terms and conditions..."
                    placeholder="Write terms and conditions..."
                    name="termsAndConditions_en"
                    value={text.termsAndConditions.en}
                    onChange={handleTextChange}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="...شرایط و ضوابط را بنویسید"
                    placeholder="...شرایط و ضوابط را بنویسید"
                    name="termsAndConditions_fa"
                    value={text.termsAndConditions.fa}
                    onChange={handleTextChange}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmit("termsAndConditions")}
                >
                    Submit
                </Button>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TextField
                    label="Write about us..."
                    placeholder="Write about us..."
                    name="aboutUs_en"
                    value={text.aboutUs.en}
                    onChange={handleTextChange}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="...درباره ما بنویسید"
                    placeholder="...درباره ما بنویسید"
                    name="aboutUs_fa"
                    value={text.aboutUs.fa}
                    onChange={handleTextChange}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmit("aboutUs")}
                >
                    Submit
                </Button>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <TextField
                    label="Write contact us..."
                    placeholder="Write contact us..."
                    name="contactUs_en"
                    value={text.contactUs.en}
                    onChange={handleTextChange}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="...تماس با ما بنویسید"
                    placeholder="...تماس با ما بنویسید"
                    name="contactUs_fa"
                    value={text.contactUs.fa}
                    onChange={handleTextChange}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmit("contactUs")}
                >
                    Submit
                </Button>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <TextField
                   
                   label="Write policy..."
                   placeholder="Write policy..."
                   name="privacyPolicy_en"
                   value={text.privacyPolicy.en}
                   onChange={handleTextChange}
                   multiline
                   rows={4}
                   fullWidth
                   margin="normal"
               />
               <TextField
                   label="...سیاست را بنویسید"
                   placeholder="...سیاست را بنویسید"
                   name="privacyPolicy_fa"
                   value={text.privacyPolicy.fa}
                   onChange={handleTextChange}
                   multiline
                   rows={4}
                   fullWidth
                   margin="normal"
               />
               <Button
                   variant="contained"
                   color="primary"
                   onClick={() => handleSubmit("privacyPolicy")}
               >
                   Submit
               </Button>
           </TabPanel>
           <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
               <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                   {snackbarMessage}
               </Alert>
           </Snackbar>
       </Box>
   );
}
