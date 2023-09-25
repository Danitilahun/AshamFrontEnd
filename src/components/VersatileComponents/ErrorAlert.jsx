import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import getAlternativeErrorMessage from "../../utils/errorCode";

const ErrorAlert = ({ message }) => {
  const errorMsg = getAlternativeErrorMessage(message);
  return (
    <Stack sx={{ width: "100%", p: 2 }} spacing={2}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {errorMsg}
      </Alert>
    </Stack>
  );
};

export default ErrorAlert;
