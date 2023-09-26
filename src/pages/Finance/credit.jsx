import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import FinanceTable from "../../components/Credit/table/financeCredit";
import Header from "../../components/VersatileComponents/Header";

const FinanceCredit = () => {
  const theme = useTheme();
  return (
    <Box
      m="1.5rem 2.5rem"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100%",
        position: "relative",
      }}
    >
      {/* <Header title="Credit" subtitle="Entire list of Credits" /> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FinanceTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinanceCredit;
