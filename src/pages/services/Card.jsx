import React from "react";
import { Box, useTheme } from "@mui/material";
import CardTable from "../../components/Card/Tables/callcenterTable";
import { Helmet } from "react-helmet";
const Card = () => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Card </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of card orders" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        <CardTable />
      </Box>
    </>
  );
};

export default Card;
