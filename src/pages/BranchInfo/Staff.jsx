import React from "react";
import { Box, Grid } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import { useParams } from "react-router-dom";
import useFilteredCollectionData from "../../hooks/useFilteredCollectionData";
import UserCard from "../../components/User/card/staff/staff";

const Staff = () => {
  const params = useParams();
  const { data: staff } = useFilteredCollectionData(
    "staff",
    "branchId",
    params.id
  );

  console.log("staff", staff);
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Staff" subtitle="Entire list of Staffs" />
      <Grid container spacing={2}>
        {staff?.map((item) => (
          <Grid key={item.id} item xs={6} sm={4} md={4} lg={4} xl={4}>
            <UserCard userInfo={item} userType={"staff"} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Staff;
