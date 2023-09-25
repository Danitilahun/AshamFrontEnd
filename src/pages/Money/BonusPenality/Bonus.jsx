import React, { useEffect, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import CreditTable from "../../../components/Credit/CreditTable";
import Header from "../../../components/VersatileComponents/Header";
import Calculator from "../../../components/VersatileComponents/MoneyNoteCalculator";

const Bonus = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Bonus" subtitle="Entire list of Bonus" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CreditTable type={"Bonus"} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Bonus;
