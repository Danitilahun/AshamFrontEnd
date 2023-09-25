import React, { useEffect, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import CreditTable from "../../../components/Credit/CreditTable";
import Header from "../../../components/VersatileComponents/Header";
import Calculator from "../../../components/VersatileComponents/MoneyNoteCalculator";

const Penality = () => {
  return (
    <Box m="1.5rem 2.5rem">
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
