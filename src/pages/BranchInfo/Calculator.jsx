import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import Calculator from "../../components/VersatileComponents/MoneyNoteCalculator";
const BranchCalculator = () => {
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
      <Grid container spacing={2}>
        <Calculator />
      </Grid>
    </Box>
  );
};

export default BranchCalculator;
