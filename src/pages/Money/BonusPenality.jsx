import React from "react";
import { Box, useTheme } from "@mui/material";
import BonusPentalityTabs from "../../components/BonusPenality/Bonus-PenalityTab";
import { Helmet } from "react-helmet-async";
const BonusPenality = () => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Bonus or Penality</title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of bonus or penalities" />
      </Helmet>
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
    </>
  );
};

export default BonusPenality;
