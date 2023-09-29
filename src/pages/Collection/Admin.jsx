import { Box, Grid, useTheme } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/VersatileComponents/Header";
import useCollectionData from "../../hooks/useCollectionData";
import UserCard from "../../components/User/card/admin/admin";
import getRequiredUserData from "../../utils/getBranchInfo";

const Admin = () => {
  const { data: admins } = useCollectionData("admin");
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
      <Header title="Branch Admin" subtitle="Entire list of Branch admin" />
      <Grid container spacing={2}>
        {admins?.map((item) => (
          <Grid key={item.id} item xs={6} sm={4} md={4} lg={4} xl={4}>
            <UserCard userInfo={item} userType={"admin"} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Admin;
