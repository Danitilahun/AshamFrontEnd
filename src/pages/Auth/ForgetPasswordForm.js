import React, { useContext, useState } from "react";
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Avatar } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../components/VersatileComponents/ErrorAlert";
import { Helmet } from "react-helmet";

const initialValues = {
  email: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const ForgetPasswordForm = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [error, setError] = useState(null);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Forget Password</title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="forget password" />
      </Helmet>
      <Container
        component="main"
        maxWidth="xs"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar style={{ backgroundColor: "#1976D2", margin: 8 }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forget Password
          </Typography>
          {error && (
            <ErrorAlert message={error} /> // Show the error alert if error exists
          )}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              forgotPassword(values.email)
                .then(() => {
                  navigate("/success", { state: { email: values.email } });
                })
                .catch((error) => {
                  setError(error.code);
                });
            }}
          >
            {({ errors, touched }) => (
              <Form style={{ width: "100%", marginTop: 8 }}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  helperText={touched.email ? errors.email : ""}
                  error={touched.email && Boolean(errors.email)}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ margin: "24px 0 16px" }}
                >
                  Send Reset Link
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </>
  );
};

export default ForgetPasswordForm;
