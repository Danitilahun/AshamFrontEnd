import React from "react";
import { Box, Grid } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import formatDateRange from "../../utils/formatDateRange";
import { useSnackbar } from "../../contexts/InfoContext";
import LeftGridItem from "../../components/Dashboard/LeftGridItem";
import RightGridItem from "../../components/Dashboard/RightGridItem";
import useDocumentById from "../../hooks/useDocumentById";

const StatusPage = () => {
  const { openSnackbar } = useSnackbar();
  let active = "";
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    active = userData ? userData.active : "try";
  }

  if (!active) {
    const storedData2 = localStorage.getItem("active");
    if (storedData2) {
      const userData = JSON.parse(storedData2);
      active = userData ? userData.active : "try";
    }
  }
  if (!active) {
    active = "try";
    openSnackbar(
      `You do not have a sheet. Create sheet before try to see the current Status.`,
      "info"
    );
  }

  const { documentData } = useDocumentById("Status", active);

  let day = "today";
  if (documentData) {
    day = formatDateRange(documentData["date"]);
  }
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Status" subtitle="Entire list of Status" />
      <Grid container spacing={3}>
        <LeftGridItem documentData={documentData} />
        <RightGridItem documentData={documentData} day={day} />
      </Grid>
    </Box>
  );
};

export default StatusPage;
