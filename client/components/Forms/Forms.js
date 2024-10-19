'use client';
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useFormSubmission } from '@/lib/hooks/useFormSubmission.js';
import { Alert, Backdrop, CircularProgress, Snackbar, IconButton } from '@mui/material';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import RemoveRedEyeSharpIcon from '@mui/icons-material/RemoveRedEyeSharp';
import styles from './Forms.module.css';

const CustomField = ({ className, ...props }) => {
  const [field, meta] = useField(props);
  const errorClass = meta.touched && meta.error ? styles.fieldError : '';
  return (
    <>
      <Field {...field} {...props} className={`${className} ${errorClass}`} />
      <ErrorMessage name={field.name} component="div" className="text-danger" />
    </>
  );
};

const validationSchemas = {
  Register: Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone_number: Yup.string(),
    username: Yup.string().required('Username is required').min(5, 'Username must be at least 5 characters').matches(/^[^\s]+$/, 'Username cannot contain spaces'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'Password must contain uppercase, lowercase, number, and special character'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  }),
  Login: Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  }),
};

const Forms = ({ fields, formType }) => {
  const router = useRouter();
  const { loading, snackState, setSnackState, handleSubmit } = useFormSubmission(router);
  const initialValues = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.form}>
      <div className={styles.formSide}>
        <h1>{formType}</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[formType]}
          onSubmit={(values) => handleSubmit(values, formType)}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className={styles.fieldContainer}>
                {fields.map((field, index) => (
                  <div key={index} className={styles.fieldWrapper}>
                    {field.name === 'password' && formType === 'Login' ? (
                      <div className={styles.passwordContainer}>
                        <CustomField
                          className={styles.field}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Password"
                          id="password"
                        />
                          <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={togglePasswordVisibility}
                            edge="end"
                            className={styles.togglePasswordButton }
                            >
                            {showPassword ? <VisibilityOffSharpIcon /> : <RemoveRedEyeSharpIcon />}
                          </IconButton>
                      </div>
                    ) : (
                      <CustomField
                        className={styles.field}
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        id={field.id}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button type="submit" className="btn btn-primary mb-3 mt-3" disabled={isSubmitting || loading}>
                {formType === 'Login' ? 'Login' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={snackState.open}
        onClose={() => setSnackState({ ...snackState, open: false })}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackState.severity} onClose={() => setSnackState({ ...snackState, open: false })} variant="filled" sx={{ width: '100%' }}>
          {snackState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Forms;
