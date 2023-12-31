import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import SheetCard from "../../components/sheet/sheetCard";
import useFilteredCollectionData from "../../hooks/useFilteredCollectionData";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const TransactionPage = () => {
  const params = useParams();
  const theme = useTheme();
  const { data: sheet } = useFilteredCollectionData(
    "sheets",
    "branchId",
    params.id
  );

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> Sheet </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of sheet" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        <Header title="Sheet" subtitle="Entire list of sheets" />
        <Grid container spacing={2}>
          {sheet.map((item) => (
            <Grid key={item.id} item xs={6} sm={4} md={4} lg={4} xl={4}>
              <SheetCard sheetInfo={item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default TransactionPage;
