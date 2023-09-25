import React from "react";
import { Box } from "@mui/material";
import BonusPentalityTabs from "../../components/BonusPenality/Bonus-PenalityTab";
import { useBranch } from "../../contexts/BranchContext";

const BonusPenality = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <BonusPentalityTabs />
    </Box>
  );
};

export default BonusPenality;
