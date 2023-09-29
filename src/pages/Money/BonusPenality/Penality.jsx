import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Paper, useTheme } from "@mui/material";
import CreditTable from "../../../components/Credit/CreditTable";
import Header from "../../../components/VersatileComponents/Header";
import Calculator from "../../../components/VersatileComponents/MoneyNoteCalculator";

const Penality = () => {
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
      <Header title="Penality" subtitle="Entire list of Penality" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CreditTable type={"Penality"} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Penality;
