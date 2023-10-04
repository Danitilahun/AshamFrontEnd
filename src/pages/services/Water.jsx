import React from "react";
import { Box, useTheme } from "@mui/material";
import WaterTable from "../../components/Water/Tables/callcenterTable";
import { Helmet } from "react-helmet";
const Water = () => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Water</title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of water orders" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        <WaterTable />
      </Box>
    </>
  );
};

export default Water;
