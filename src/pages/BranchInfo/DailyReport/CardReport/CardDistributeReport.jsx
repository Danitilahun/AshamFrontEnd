import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import CardDistributeTable from "../../../../components/Report/tables/cardDistribute";
import { Helmet } from "react-helmet";
const CardDistribute = () => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Card Distribute Report </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of Card Distribute Report" />
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
            <CardDistributeTable />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CardDistribute;
