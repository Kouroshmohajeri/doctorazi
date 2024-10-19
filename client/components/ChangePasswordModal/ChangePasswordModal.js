import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { changePassword } from '@/lib/actions/users/actions';

const ChangePasswordModal = ({ open, onClose, userId}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const initialValues = {
        newPassword: '',
        confirmPassword: ''
    };

    const validationSchema = Yup.object().shape({
        newPassword: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                'Password must contain uppercase, lowercase, number, and special character'
            ),
        confirmPassword: Yup.string()
            .required('Confirm your password')
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await changePassword(userId.userId, values.newPassword).then((res)=>{
                alert('Password changed successfully');
            });
            resetForm();
            onClose();
        } catch (error) {
            setErrorMessage('Failed to change password. Please try again.');
            console.error('Error changing password:', error);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="change-password-modal"
            aria-describedby="change-password-form"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, display:"flex", flexDirection:"column", justifyContent:"space-evenly", alignItems:"center", bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: "15px" }}>
                <Typography variant="h6" id="change-password-modal" gutterBottom>
                    Change Password
                </Typography>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form>
                        <Field
                            className='mb-4'
                            as={TextField}
                            fullWidth
                            type="password"
                            label="New Password"
                            name="newPassword"
                        />
                        <ErrorMessage name="newPassword" component="div" className="text-danger" />
                        <br />
                        <Field
                            className='mb-4'
                            as={TextField}
                            fullWidth
                            type="password"
                            label="Confirm Password"
                            name="confirmPassword"
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                        {errorMessage && <div className="text-danger">{errorMessage}</div>}
                        <br />
                        <div className='d-flex flex-column'>
                            <Button className={`btn btn-primary mb-2`} type="submit">
                                Change Password
                            </Button>
                            <Button className={`btn btn-outline-danger`} onClick={handleCancel}>
                                <CloseSharpIcon/>
                            </Button>
                        </div>
                    </Form>
                </Formik>
            </Box>
        </Modal>
    );
};

export default ChangePasswordModal;
