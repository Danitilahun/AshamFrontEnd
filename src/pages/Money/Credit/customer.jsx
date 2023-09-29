import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Paper, useTheme } from "@mui/material";
import CreditTable from "../../../components/Credit/CreditTable";
import Header from "../../../components/VersatileComponents/Header";
import Calculator from "../../../components/VersatileComponents/MoneyNoteCalculator";
import CustomerCreditTable from "../../../components/Credit/table/customerCredit";

const Customer = ({ initialData }) => {
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
      {/* <Header
        title="Customer credit"
        subtitle="Entire list of Customer credits"
      /> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CustomerCreditTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Customer;
