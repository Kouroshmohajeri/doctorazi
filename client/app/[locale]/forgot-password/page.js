"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  Paper,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
} from "@mui/material";
import styles from "./forgotPassword.module.css";
import { resetPassword } from "@/lib/actions/users/actions";

const ResetPasswordPage = () => {
  const [resetStatus, setResetStatus] = useState({
    success: false,
    error: null,
  });
  const [resetOption, setResetOption] = useState("email"); // Default to email

  const initialValues = {
    email: "",
    username: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .when("resetOption", {
        is: (resetOption) => resetOption === "email",
        then: Yup.string().required("Email is required"),
        otherwise: Yup.string(),
      }),
    username: Yup.string().when("resetOption", {
      is: (resetOption) => resetOption === "username",
      then: Yup.string().required("Username is required"),
      otherwise: Yup.string(),
    }),
  });

  const handleOptionChange = (event) => {
    setResetOption(event.target.value);
  };

  const handleSubmit = async (values) => {
    try {
      const resetIdentifier =
        resetOption === "email" ? values.email : values.username;

      await resetPassword(resetIdentifier, resetOption);

      setResetStatus({ success: true, error: null });
    } catch (error) {
      console.error("Error initiating password reset:", error);
      setResetStatus({
        success: false,
        error: "Failed to initiate password reset. Please try again.",
      });
    }
  };

  return (
    <main className={styles.main}>
      <Paper className={styles.paper}>
        <Typography variant="h5" component="h1" gutterBottom>
          Reset Password
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="resetOption"
            name="resetOption"
            value={resetOption}
            onChange={handleOptionChange}
          >
            <FormControlLabel value="email" control={<Radio />} label="Email" />
            <FormControlLabel
              value="username"
              control={<Radio />}
              label="Username"
            />
          </RadioGroup>
        </FormControl>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              {resetOption === "email" && (
                <div>
                  <Field
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    as={TextField}
                    margin="normal"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className={styles.errorMessage}
                  />
                </div>
              )}
              {resetOption === "username" && (
                <div>
                  <Field
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    type="text"
                    as={TextField}
                    margin="normal"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className={styles.errorMessage}
                  />
                </div>
              )}
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
                <Typography
                  variant="body1"
                  color="success.main"
                  className={styles.successMessage}
                >
                  Password reset instructions have been sent to your email
                </Typography>
              )}
              {resetStatus.error && (
                <Typography
                  variant="body1"
                  color="error"
                  className={styles.errorMessage}
                >
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

export default ResetPasswordPage;
