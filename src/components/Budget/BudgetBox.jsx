import { Box, Typography } from "@mui/material";
import React from "react";

const BudgetInfo = () => {
  return (
    <Box boxShadow={2} p={3}>
      <Typography variant="h6" component="h2">
        Budget Info
      </Typography>
    </Box>
  );
};

export default BudgetInfo;
