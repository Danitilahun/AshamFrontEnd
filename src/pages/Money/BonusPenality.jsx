import React from "react";
import { Box, useTheme } from "@mui/material";
import BonusPentalityTabs from "../../components/BonusPenality/Bonus-PenalityTab";
import { useBranch } from "../../contexts/BranchContext";

const BonusPenality = () => {
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
      <BonusPentalityTabs />
    </Box>
  );
};

export default BonusPenality;
