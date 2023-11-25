import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/VersatileComponents/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useBranch } from "../contexts/BranchContext";

const TableLayout = () => {
  const { currentUser } = useAuth();
  const { changeBranchInfo, changecallCenterName } = useBranch();
  changecallCenterName("");
  changeBranchInfo("");
  return (
    <Box width="100%" height="100%">
      <Box flexGrow={1}>
        <Navbar
          currentUser={currentUser || {}}
          isSidebarOpen={""}
          setIsSidebarOpen={""}
          from="table"
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default TableLayout;
