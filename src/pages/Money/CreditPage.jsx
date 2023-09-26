import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import MyTabs from "../../components/Credit/tabs";

const CreditPage = () => {
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MyTabs />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreditPage;
