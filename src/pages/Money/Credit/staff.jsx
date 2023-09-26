import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, useTheme } from "@mui/material";
import Header from "../../../components/VersatileComponents/Header";
import StaffCreditTable from "../../../components/Credit/table/staffCredit";

const Staff = () => {
  const theme = useTheme();
  return (
    <Box
      m="1.5rem 2.5rem"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100vh",
        position: "relative",
      }}
    >
      {/* <Header title="Staff credit" subtitle="Entire list of Customer credits" /> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StaffCreditTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Staff;
