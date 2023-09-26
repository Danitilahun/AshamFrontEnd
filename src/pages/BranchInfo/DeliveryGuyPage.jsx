import React, { useEffect, useState } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import { useParams } from "react-router-dom";
import useFilteredCollectionData from "../../hooks/useFilteredCollectionData";
import UserCard from "../../components/User/card/deliveryGuy/deliveryGuy";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

const DeliveryGuyPage = () => {
  const params = useParams();
  const theme = useTheme();
  console.log("params", params);
  const { data: deliveryguys } = useFilteredCollectionData(
    "deliveryguy",
    "branchId",
    params.id ? params.id : "nothing"
  );

  useEffect(() => {
    if (params.id) {
      const worksRef = doc(collection(firestore, "branches"), params.id);

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(worksRef, (doc) => {
        if (doc.exists()) {
          localStorage.setItem(
            "userData",
            JSON.stringify({
              ...doc.data(),
              id: doc.id,
            })
          );
          // settableDate(.tableDate);
        }
      });

      // Clean up the subscription when the component unmounts
      return () => unsubscribe();
    }
  }, [params.id]);

  return (
    <Box
      m="1.5rem 2.5rem"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100%",
        position: "relative",
      }}
    >
      <Header title="Delivery Guy" subtitle="Entire list of Delivery Guys" />
      <Grid container spacing={2}>
        {deliveryguys.map((item) => (
          <Grid key={item.id} item xs={6} sm={4} md={4} lg={4} xl={4}>
            <UserCard userInfo={item} userType={"deliveryguy"} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DeliveryGuyPage;
