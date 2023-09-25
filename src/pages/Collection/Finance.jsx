import React, { useEffect, useState } from "react";
import Header from "../../components/VersatileComponents/Header";
import { Box, Grid } from "@mui/material";
import useCollectionData from "../../hooks/useCollectionData";
import UserCard from "../../components/User/card/finance/finance";

const Finance = () => {
  const { data: finances } = useCollectionData("finance");
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Finance" subtitle="Entire list of Finance" />
      <Grid container spacing={2}>
        {finances.map((item) => (
          <Grid key={item.id} item xs={6} sm={4} md={4} lg={4} xl={4}>
            <UserCard userInfo={item} userType={"finance"} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Finance;
