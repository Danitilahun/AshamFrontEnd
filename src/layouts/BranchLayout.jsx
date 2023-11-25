import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import BranchSidebar from "../components/sidebar/BranchSidebar";
import Navbar from "../components/VersatileComponents/Navbar";
import { useAuth } from "../contexts/AuthContext";

const BranchLayout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser } = useAuth();

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <BranchSidebar
        user={currentUser || {}}
        isNonMobile={isNonMobile}
        drawerWidth="290px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <Navbar
          currentUser={currentUser || {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default BranchLayout;
