import React from "react";
import { Box, Grid, Paper } from "@mui/material";
import Header from "../../../../components/VersatileComponents/Header";
import ReportTable from "../../../../components/Report/ReportTable";
import CardDistributeTable from "../../../../components/Report/tables/cardDistribute";

const CardDistribute = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Card Distribute Report"
        subtitle="Entire list of Card Distribute Reports"
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CardDistributeTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardDistribute;
