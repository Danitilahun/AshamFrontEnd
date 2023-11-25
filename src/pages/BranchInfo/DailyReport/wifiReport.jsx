import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import WifiDistributeTable from "../../../components/Report/tables/wifiDistribute";
import { Helmet } from "react-helmet-async";
const WifiDistribute = () => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Wifi Report </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of wifi reports" />
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
            <WifiDistributeTable />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default WifiDistribute;
