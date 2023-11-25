import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import { useParams } from "react-router-dom";
import useFilteredCollectionData from "../../hooks/useFilteredCollectionData";
import UserCard from "../../components/User/card/staff/staff";
import { Helmet } from "react-helmet-async";
const Staff = () => {
  const params = useParams();
  const theme = useTheme();
  const { data: staff } = useFilteredCollectionData(
    "staff",
    "branchId",
    params.id
  );

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Staff</title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of staffs" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100vh",
          position: "relative",
        }}
      >
        <Header title="Staff" subtitle="Entire list of Staffs" />
        <Grid container spacing={2}>
          {staff?.map((item) => (
            <Grid key={item.id} item xs={6} sm={4} md={4} lg={4} xl={4}>
              <UserCard userInfo={item} userType={"staff"} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Staff;
