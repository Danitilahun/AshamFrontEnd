import React from "react";
import { Box, useTheme } from "@mui/material";
import AsbezaTable from "../../components/Asbeza/Tables/callcenterTable";
import { Helmet } from "react-helmet-async";
const Asbeza = () => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Asbeza </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of Asbeza orders" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        <AsbezaTable />
      </Box>
    </>
  );
};

export default Asbeza;
