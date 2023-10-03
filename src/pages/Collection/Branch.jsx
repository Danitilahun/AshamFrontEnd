import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/VersatileComponents/Header";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import BranchCard from "../../components/Branch/BranchCard";
import useCollectionData from "../../hooks/useCollectionData";
import { useAuth } from "../../contexts/AuthContext";
import useDocumentById from "../../hooks/useDocumentById";
import useUserClaims from "../../hooks/useUserClaims";
import ShowBudget from "../../components/Budget/ShowBudget";

const Branch = () => {
  const { user } = useAuth();
  const userClaim = useUserClaims(user);
  const { data: branches } = useCollectionData("branches");
  const { documentData: finance } = useDocumentById("finance", user.uid);
  const theme = useTheme();
  console.log("finance", finance);
  return (
    <Box
      m="1.5rem 2.5rem"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100%",
        position: "relative",
      }}
    >
      {userClaim.finance ? (
        <Grid container spacing={2} style={{ marginBottom: "50px" }}>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <Box flex="1">
              <Typography
                variant="h2"
                color={theme.palette.secondary[100]}
                fontWeight="bold"
                sx={{ mb: "5px" }}
              >
                Branch
              </Typography>

              <Typography variant="h5" color={theme.palette.secondary[300]}>
                Entire list of Branches
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              //   margin: "0 30",
            }}
          >
            {userClaim.finance ? (
              <ShowBudget
                label={"Next Budget"}
                value={
                  finance?.budget -
                  finance?.credit -
                  finance?.balance +
                  finance?.BudgetSummery
                }
                marginTop={10}
              />
            ) : null}
          </Grid>
        </Grid>
      ) : null}
      {userClaim.superAdmin ? (
        <Header title="Branch" subtitle="Entire list of Branches" />
      ) : null}
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
