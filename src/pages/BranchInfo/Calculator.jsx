import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import { useParams } from "react-router-dom";
import Calculator from "../../components/VersatileComponents/MoneyNoteCalculator";
const BranchCalculator = () => {
  const params = useParams();

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Delivery Guy" subtitle="Entire list of Delivery Guys" />
      <Grid container spacing={2}>
        <Calculator />
      </Grid>
    </Box>
  );
};

export default BranchCalculator;
