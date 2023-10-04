import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import FinanceTable from "../../components/Credit/table/financeCredit";
import { Helmet } from "react-helmet";
const FinanceCredit = () => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Credit</title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of credits" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FinanceTable />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default FinanceCredit;
