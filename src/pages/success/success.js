import React from "react";
import { Container, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SuccessPage = () => {
  const location = useLocation();
  const { email } = location.state || {};
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Success</title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="Success page" />
      </Helmet>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CheckCircleIcon sx={{ color: "green", fontSize: "64px", mb: 2 }} />
        <Typography variant="h4" sx={{ color: "green", mb: 2 }}>
          Successfully Sent!
        </Typography>
        <Typography variant="body1" sx={{ color: "green" }}>
          A password reset email has been sent to:
        </Typography>
        <Typography variant="body2" sx={{ color: "green", fontWeight: "bold" }}>
          {email}
        </Typography>
      </Container>
    </>
  );
};

export default SuccessPage;
