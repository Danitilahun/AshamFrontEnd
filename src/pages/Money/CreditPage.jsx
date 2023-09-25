import React from "react";
import { Box, Grid } from "@mui/material";
import MyTabs from "../../components/Credit/tabs";

const CreditPage = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MyTabs />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreditPage;
