import React, { useContext, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import BranchSidebar from "../components/sidebar/BranchSidebar";
import Navbar from "../components/VersatileComponents/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useBranch } from "../contexts/BranchContext";
import ServiceSidebar from "../components/sidebar/serviceSidebar";

const ServiceLayout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser } = useAuth();
  const { changeBranchInfo } = useBranch();
  changeBranchInfo("");

  // Extract the current URL and the dynamic "id" parameter from the location object

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <ServiceSidebar
        currentUser={currentUser || {}}
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
          from="callcenter"
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default ServiceLayout;
