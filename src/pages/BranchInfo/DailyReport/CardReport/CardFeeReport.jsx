import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, useTheme } from "@mui/material";
import CardFeeTable from "../../../../components/Report/tables/cardFee";

const CardFee = () => {
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
      {/* <Header
        title="Card Fee Report"
        subtitle="Entire list of Card Fee Reports"
      /> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CardFeeTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardFee;
