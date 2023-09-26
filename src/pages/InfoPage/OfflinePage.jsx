import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const OfflinePage = () => {
  return (
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
        src="/assets/no-internet-access.png"
        alt="Offline"
        sx={{
          width: "100%",
          maxWidth: "300px",
          marginBottom: (theme) => theme.spacing(2),
        }}
      />
      <Typography variant="h4" color="textSecondary">
        You are offline
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Please check your internet connection.
      </Typography>
    </Box>
  );
};

export default OfflinePage;
