import React, { useEffect, useState } from "react";
import Header from "../../components/VersatileComponents/Header";
import { Box, Grid } from "@mui/material";
import BranchCard from "../../components/Branch/BranchCard";
import useCollectionData from "../../hooks/useCollectionData";

const Branch = () => {
  const { data: branches } = useCollectionData("branches");

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Branch" subtitle="Entire list of Branches" />
      <Grid container spacing={2}>
        {branches?.map((item) => (
          <Grid key={item.id} item xs={6} sm={4} md={4} lg={4} xl={4}>
            <BranchCard branchData={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Branch;
