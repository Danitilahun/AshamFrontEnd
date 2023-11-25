import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import CardFeeTable from "../../../../components/Report/tables/cardFee";
import { Helmet } from "react-helmet-async";
const CardFee = () => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Card Fee Report </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of card fee report" />
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
            <CardFeeTable />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CardFee;
