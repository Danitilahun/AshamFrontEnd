import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import AsbezaCard from "../../../components/Asbeza/AsbezaCard";
import Header from "../../../components/VersatileComponents/Header";
import { useParams } from "react-router-dom";
import getData from "../../../api/services/DeliveryGuy/getDeliveryGuy";
import AsbezaTable from "../../../components/Asbeza/Tables/branchTable";

const BranchAsbeza = () => {
  const [admins, setAdmins] = useState([]);
  const param = useParams();
  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = getData("Asbeza", "branch", param.id, setAdmins);
    return () => unsubscribe();
  }, []);

  console.log("asbeza", admins);

  return (
    <Box
      m="1.5rem 2.5rem"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100%",
        position: "relative",
      }}
    >
      {/* <Header
        title="Asbeza Order"
        subtitle="Entire list of Asbeza Orders"
        from="branch"
      /> */}
      <AsbezaTable />
    </Box>
  );
};

export default BranchAsbeza;
