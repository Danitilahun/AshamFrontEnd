// import React, { useState } from "react";
// import {
//   Avatar,
//   Button,
//   CircularProgress,
//   Container,
//   IconButton,
//   InputAdornment,
//   Paper,
//   TextField,
//   Typography,
//   useTheme,
// } from "@mui/material";
// import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import ErrorAlert from "../../components/VersatileComponents/ErrorAlert";
// import { Helmet } from "react-helmet";
// const initialValues = {
//   email: "",
//   password: "",
// };

// const validationSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email").required("Required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Required"),
// });

// const LoginForm = () => {
//   const [showPassword, setShowPassword] = React.useState(false);
//   const { login, isLoading } = useAuth();
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const handlePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   return (
//     <>
//       <Helmet>
//         <meta charSet="utf-8" />
//         <title>Login Page </title>
//         {/* <link rel="canonical" href="http://localhost:3000/" /> */}
//         <meta name="description" content="login page" />
//       </Helmet>
//       <Container
//         component="main"
//         maxWidth="xs"
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <Paper
//           elevation={3}
//           style={{
//             padding: 16,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Avatar style={{ backgroundColor: "#1976D2", margin: 8 }}>
//             <LockOutlined />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Login
//           </Typography>
//           {error && (
//             <ErrorAlert message={error} /> // Show the error alert if error exists
//           )}
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={(values) => {
//               console.log(values);
//               login(values.email, values.password)
//                 .then((res) => {
//                   // console.log(res);
//                   navigate("/log");
//                 })
//                 .catch((error) => {
//                   // navigate("/error", { state: { errorMessage: error.message } });
//                   console.log(error.code);
//                   setError(error.code);
//                   // ErrorAlert(error.code);
//                 });
//             }}
//           >
//             {({ errors, touched }) => (
//               <Form style={{ width: "100%", marginTop: 8 }}>
//                 <Field
//                   as={TextField}
//                   variant="outlined"
//                   margin="normal"
//                   fullWidth
//                   id="email"
//                   label="Email Address"
//                   name="email"
//                   autoComplete="email"
//                   helperText={touched.email ? errors.email : ""}
//                   error={touched.email && Boolean(errors.email)}
//                 />

//                 <Field
//                   as={TextField}
//                   variant="outlined"
//                   margin="normal"
//                   fullWidth
//                   id="password"
//                   label="Password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="new-password"
//                   helperText={touched.password ? errors.password : ""}
//                   error={touched.password && Boolean(errors.password)}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           edge="end"
//                           aria-label="toggle password visibility"
//                           onClick={handlePasswordVisibility}
//                           onMouseDown={(e) => e.preventDefault()}
//                         >
//                           {showPassword ? <Visibility /> : <VisibilityOff />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 <Typography
//                   variant="body2"
//                   sx={{
//                     textAlign: "end",
//                     padding: "10px",
//                     fontSize: "1rem",
//                     color: theme.palette.text.secondary,
//                     fontWeight: 500,
//                   }}
//                 >
//                   <Link
//                     to="/forget-password"
//                     color="secondary"
//                     style={{ textDecoration: "none" }}
//                   >
//                     Forgot Password
//                   </Link>
//                 </Typography>

//                 <Button
//                   type="submit"
//                   fullWidth
//                   variant="contained"
//                   color="primary"
//                   style={{ margin: "24px 0 16px" }}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <CircularProgress size={24} color="inherit" />
//                   ) : (
//                     "Sign In"
//                   )}
//                 </Button>
//               </Form>
//             )}
//           </Formik>
//         </Paper>
//       </Container>
//     </>
//   );
// };

// export default LoginForm;

import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Slide,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ErrorAlert from "../../components/VersatileComponents/ErrorAlert";
import { Helmet } from "react-helmet";

const bgImage = "/assets/login.png";
const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
      }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login Page </title>
        <meta name="description" content="login page" />
      </Helmet>

      <Container
        component="main"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper elevation={3} style={{ padding: 16, width: 400 }}>
          <Typography component="h1" variant="h5" align="center">
            Login
          </Typography>
          {error && <ErrorAlert message={error} />}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              login(values.email, values.password)
                .then((res) => {
                  navigate("/log");
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

                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  helperText={touched.password ? errors.password : ""}
                  error={touched.password && Boolean(errors.password)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="toggle password visibility"
                          onClick={handlePasswordVisibility}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "end",
                    padding: "10px",
                    fontSize: "1rem",
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  <Link
                    to="/forget-password"
                    color="secondary"
                    style={{
                      textDecoration: "none",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Forgot Password
                  </Link>
                </Typography>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ margin: "24px 0 16px" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginForm;
