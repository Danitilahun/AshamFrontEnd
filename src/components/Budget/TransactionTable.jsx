import React from "react";
import { Grid } from "@mui/material";
import CustomPaper from "../CustomComponents/CustomPaper";
import DataEntry from "./DataEntry";

const scrollableGridStyle = {
  maxHeight: "200px", // Set your desired height here
  overflowY: "auto",
};

const TransactionTable = ({ data }) => (
  <CustomPaper marginBottom={5}>
    <Grid item xs={12} md={12}>
      <Grid container justifyContent="space-between" spacing={3}>
        <Grid item xs={4} md={4}>
          <CustomPaper>Date</CustomPaper>
        </Grid>
        <Grid item xs={4} md={4}>
          <CustomPaper>Status</CustomPaper>
        </Grid>
        <Grid item xs={4} md={4}>
          <CustomPaper>Amount</CustomPaper>
        </Grid>
      </Grid>
    </Grid>
    {data && (
      <Grid item xs={12}>
        <CustomPaper>
          <Grid container spacing={2} style={scrollableGridStyle}>
            {data.map((entry, index) => (
              <DataEntry
                key={index}
                data={entry.date}
                status={entry.status}
                amount={entry.amount}
              />
            ))}
          </Grid>
        </CustomPaper>
      </Grid>
    )}
  </CustomPaper>
);

export default TransactionTable;
