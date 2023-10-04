import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import HotelProfitTable from "../../../components/Report/tables/hospitalProfit";
import { Helmet } from "react-helmet";
const HotelProfit = () => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Hotel profit Report </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of Hotel profit Reports" />
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
            <HotelProfitTable />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HotelProfit;
