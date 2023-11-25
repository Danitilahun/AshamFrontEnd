import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Helmet } from "react-helmet-async";
const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Not found </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="Not found page" />
      </Helmet>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: (theme) => theme.spacing(3),
        }}
      >
        <img
          src="/assets/404.png"
          alt="404"
          style={{ maxWidth: "300px", marginBottom: "16px" }}
        />
        <Typography variant="h4" color="textSecondary">
          404 - Page Not Found
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          The page you are looking for does not exist.
        </Typography>
      </Box>
    </>
  );
};

export default NotFoundPage;
