import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import StaffCreditTable from "../../../components/Credit/table/staffCredit";
import { Helmet } from "react-helmet-async";
const Staff = ({ StaffCredit }) => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Staff Credit </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of branch delivery guys" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100vh",
          position: "relative",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StaffCreditTable StaffCredit={StaffCredit} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Staff;
