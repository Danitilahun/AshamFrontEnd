import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import Calculator from "../../components/VersatileComponents/MoneyNoteCalculator";
import { Helmet } from "react-helmet-async";
const BranchCalculator = () => {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Calculator</title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="Calculator page" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        <Grid container spacing={2}>
          <Calculator />
        </Grid>
      </Box>
    </>
  );
};

export default BranchCalculator;
