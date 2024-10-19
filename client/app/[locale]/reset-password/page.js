'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Adjusted for Next.js App Router
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Paper, Typography, TextField, LinearProgress } from '@mui/material';
import { completePasswordReset } from '@/lib/actions/users/actions'; // Ensure the path is correct
import styles from './resetPassword.module.css';
import Header from '@/components/Header/Header';

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Retrieve the token from the query parameters
  const [resetStatus, setResetStatus] = useState({ success: false, error: null });
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const initialValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const getPasswordStrength = (password) => {
    // Check password strength based on complexity requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);

    return {
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    };
  };

  const getPasswordStrengthPercentage = (password) => {
    const strength = getPasswordStrength(password);
    const { hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = strength;
    const totalConditions = 4;
    let completedConditions = 0;

    if (hasUpperCase) completedConditions++;
    if (hasLowerCase) completedConditions++;
    if (hasNumber) completedConditions++;
    if (hasSpecialChar) completedConditions++;

    return (completedConditions / totalConditions) * 100;
  };

  const getProgressColor = (password) => {
    const strength = getPasswordStrength(password);
    const { hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = strength;

    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
      return 'success'; // Green color
    } else if (
      hasUpperCase ||
      hasLowerCase ||
      hasNumber ||
      hasSpecialChar
    ) {
      return 'warning'; // Yellow color
    } else {
      return 'error'; // Red color
    }
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPasswordStrength(getPasswordStrength(value));
  };

  const handleSubmit = async (values) => {
    try {
      await completePasswordReset(token, values.newPassword);
      setResetStatus({ success: true, error: null });
    } catch (error) {
      console.error('Error resetting password:', error);
      setResetStatus({ success: false, error: 'Failed to reset password. Please try again.' });
    }
  };

  return (
    <main className={styles.main}>
      <Header />
      <Paper className={styles.paper}>
        <Typography variant="h5" component="h1" className={styles.typography}>
          Reset Password
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <Field
                fullWidth
                id="newPassword"
                name="newPassword"
                label="New Password"
                type="password"
                as={TextField}
                margin="normal"
                className={styles.formControl}
                onChange={(event) => {
                  handleChange(event);
                  handlePasswordChange(event);
                }}
                onBlur={handleBlur}
              />
              <ErrorMessage name="newPassword" component="div" className={styles.errorMessage} />

              {/* Password strength indicator */}
              {values.newPassword !== '' && (
                <LinearProgress
                  variant="determinate"
                  value={getPasswordStrengthPercentage(values.newPassword)}
                  color={getProgressColor(values.newPassword)}
                  className={styles.progressBar}
                />
              )}

              <Field
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                as={TextField}
                margin="normal"
                className={styles.formControl}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="confirmPassword" component="div" className={styles.errorMessage} />

              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                Reset Password
              </Button>

              {resetStatus.success && (
                <Typography variant="body1" color="success.main" className={styles.successMessage}>
                  Password has been reset successfully
                </Typography>
              )}
              {resetStatus.error && (
                <Typography variant="body1" color="error" className={styles.errorMessage}>
                  {resetStatus.error}
                </Typography>
              )}
            </Form>
          )}
        </Formik>
      </Paper>
    </main>
  );
};

export default ResetPassword;
