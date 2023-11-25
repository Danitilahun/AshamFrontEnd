import React from "react";
import Header from "../../components/VersatileComponents/Header";
import { Box, Grid, useTheme } from "@mui/material";
import useCollectionData from "../../hooks/useCollectionData";
import UserCard from "../../components/User/card/callCenter/callCenter";
import { Helmet } from "react-helmet-async";
const CallCenter = () => {
  const { data: callcenters } = useCollectionData("callcenter");
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Call center</title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of call centers" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        <Header title="Call Center" subtitle="Entire list of Call Centers" />
        <Grid container spacing={2}>
          {callcenters.map((item) => (
            <Grid key={item.id} item xs={6} sm={4} md={4} lg={4} xl={4}>
              <UserCard userInfo={item} userType={"callcenter"} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default CallCenter;
