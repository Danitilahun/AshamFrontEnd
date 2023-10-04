import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import DailyCreditTable from "../../../components/Credit/table/dailyCredit";
import { Helmet } from "react-helmet";
const Daily = ({ initialData }) => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Daily Credit </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of daily credit" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100vh",
          position: "relative",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DailyCreditTable />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Daily;
