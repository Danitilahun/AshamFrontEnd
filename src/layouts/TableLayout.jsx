import React, { useContext, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import BranchSidebar from "../components/sidebar/BranchSidebar";
import Navbar from "../components/VersatileComponents/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useBranch } from "../contexts/BranchContext";

const TableLayout = () => {
  //   const isNonMobile = useMediaQuery("(min-width: 600px)");
  //   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser } = useAuth();
  const { changeBranchInfo, changecallCenterName } = useBranch();
  changecallCenterName("");
  changeBranchInfo("");

  const location = useLocation(); // Get the location object

  // Extract the current URL and the dynamic "id" parameter from the location object

  return (
    <Box width="100%" height="100%">
      {/* <BranchSidebar
        user={currentUser || {}}
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      /> */}
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
