import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import BranchSidebar from "../components/sidebar/BranchSidebar";
import Navbar from "../components/VersatileComponents/Navbar";
import { useAuth } from "../contexts/AuthContext";
import MoneySidebar from "../components/sidebar/MoneySidebar";
import { useBranch } from "../contexts/BranchContext";

const MoneyLayout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser } = useAuth();

  const location = useLocation(); // Get the location object

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <MoneySidebar
        user={currentUser || {}}
        isNonMobile={isNonMobile}
        drawerWidth="250px"
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

export default MoneyLayout;
