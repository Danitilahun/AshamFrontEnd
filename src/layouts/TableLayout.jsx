import React, { useContext, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import BranchSidebar from "../components/sidebar/BranchSidebar";
import Navbar from "../components/VersatileComponents/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useBranch } from "../contexts/BranchContext";

const TableLayout = () => {
  const { currentUser } = useAuth();
  const { changeBranchInfo, changecallCenterName } = useBranch();
  changecallCenterName("");
  changeBranchInfo("");

  const location = useLocation(); // Get the location object

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
