import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import WaterDistributeTable from "../../../components/Report/tables/waterDIstribute";
import { Helmet } from "react-helmet";
const WaterDistribute = () => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Water Report </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of water reports" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        {/* <Header title="Water Report" subtitle="Entire list of water Reports" /> */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <WaterDistributeTable />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default WaterDistribute;
