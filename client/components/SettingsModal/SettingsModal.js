import React, { useContext, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { getUserById, updateUser } from '@/lib/actions/users/actions';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserDataContext } from '@/context/UserDatasContext';
import styles from './SettingsModal.module.css';
import ChangePasswordModal from '../ChangePasswordModal/ChangePasswordModal';
import { ClinicalRecordContext } from '@/context/ClinicalRecordContext';

const SettingsModal = ({ open, onClose }) => {
    const { fetchCookies, users } = useContext(UserDataContext);
    const [userData, setUserData] = useState(null);
    const {refresh, setRefresh} = useContext(ClinicalRecordContext);
    useEffect(() => {
        fetchCookies();
    }, []);

    useEffect(() => {
        if (users.id) {
            fetchUserData();
        }
    }, [users.id,refresh]);

    const fetchUserData = async () => {
        try {
            const userDataResponse = await getUserById(users.id);
            setUserData(userDataResponse);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const initialValues = {
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        email: userData?.email || '',
        phone_number: userData?.phone_number || '',
        username: userData?.username || ''
    };

    const validationSchema = Yup.object().shape({
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phone_number: Yup.string().required('Phone number is required'),
        username: Yup.string().required('Username is required')
    });

    const handleSubmit = async (values) => {
        try {
            await updateUser(users.id, {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                phone_number: values.phone_number,
                username: values.username
            });
            alert("User details updated successfully");
            onClose();
            setRefresh(!refresh)
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="settings-modal"
            aria-describedby="update-user-settings"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, display:"flex", flexDirection:"column", justifyContent:"space-evenly", alignItems:"center", bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: "15px" }}>
                <Typography variant="h6" id="settings-modal" gutterBottom>
                    User Settings
                </Typography>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
                    <Form>
                        <Field
                            className='mb-4'
                            as={TextField}
                            fullWidth
                            label="First Name"
                            name="first_name"
                        />
                        <ErrorMessage name="first_name" component="div" className="text-danger" />
                        <br />
                        <Field
                            className='mb-4'
                            as={TextField}
                            fullWidth
                            label="Last Name"
                            name="last_name"
                        />
                        <ErrorMessage name="last_name" component="div" className="text-danger" />
                        <br />
                        <Field
                            className='mb-4'
                            as={TextField}
                            fullWidth
                            label="Email"
                            name="email"
                        />
                        <ErrorMessage name="email" component="div" className="text-danger" />
                        <Field
                            className='mb-4'
                            as={TextField}
                            fullWidth
                            label="Phone Number"
                            name="phone_number"
                        />
                        <ErrorMessage name="phone_number" component="div" className="text-danger" />
                        <br />
                        <Field
                            className='mb-4'
                            as={TextField}
                            fullWidth
                            label="Username"
                            name="username"
                        />
                        <ErrorMessage name="username" component="div" className="text-danger" />
                        <br />
                        <button className={`btn btn-primary mb-4 ${styles.btn}`} type="submit">
                            Update
                        </button>
                    </Form>
                </Formik>
                <ChangePasswordButton userId={users.id}/>
            </Box>
        </Modal>
    );
};

const ChangePasswordButton = (userId) => {
    const [openPasswordModal, setOpenPasswordModal] = useState(false);

    const handleOpenPasswordModal = () => {
        setOpenPasswordModal(true);
    };

    const handleClosePasswordModal = () => {
        setOpenPasswordModal(false);
    };

    return (
        <>
            <Button variant="contained" color="secondary" onClick={handleOpenPasswordModal}>
                Change Password
            </Button>
            <ChangePasswordModal open={openPasswordModal} onClose={handleClosePasswordModal} userId={userId}/>
        </>
    );
};

export default SettingsModal;
