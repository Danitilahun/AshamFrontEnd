import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import UserCard from "../../components/User/UserCard";
import { useParams } from "react-router-dom";
import getDocumentById from "../../api/utils/try";
import useFilteredCollectionData from "../../hooks/useFilteredCollectionData";
import { useDispatch, useSelector } from "react-redux";
import CreditTable from "../../components/Credit/CreditTable";
import useDocumentById from "../../hooks/useDocumentById";
import ShowBudget from "../../components/Budget/ShowBudget";
import BankTable from "../../components/Bank/table";

const Bank = () => {
  const params = useParams();
  const { selectedItemId, selectedItem, loading } = useSelector(
    (state) => state.itemDetails
  );
  console.log("selectedItem----------del", selectedItem);
  console.log("selectedItemId---------del", selectedItemId);

  let bank = [];
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    bank = userData ? userData.bank : [];
  }
  const { documentData } = useDocumentById("Bank", params.id);

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Bank Transaction"
        subtitle="Entire list of Bank"
        source="branches"
      />
      <Grid container spacing={2}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <ShowBudget
            label={"Total bank balance"}
            value={documentData?.total}
            marginTop={10}
          />
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
      <Grid container spacing={2} marginTop={"10px"}>
        {bank?.map((bankName, index) => (
          <Grid item xs={6} key={index}>
            <Typography variant="h6" fontWeight="bold" fontSize={"24px"}>
              {bankName}
            </Typography>
            <BankTable bankName={bankName} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Bank;
