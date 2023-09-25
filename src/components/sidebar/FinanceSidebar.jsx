import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { ChevronLeft, ChevronRightOutlined, Money } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../VersatileComponents/FlexBetween";
import PersonIcon from "@mui/icons-material/Person";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { useAuth } from "../../contexts/AuthContext";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

const navItems = [
  {
    text: "Salary",
    path: "genzeb/salary",
    icon: <PersonIcon />,
  },
  {
    text: "Budget",
    path: "genzeb/budget",
    icon: <PersonIcon />,
  },
  {
    text: "Bonus / Penality",
    path: "genzeb/bonuspenality",
    icon: <SummarizeIcon />,
  },
];

const FinanceSidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  // const { callCenterId } = useBranch();
  let branchId = "";
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    branchId = userData.id !== undefined ? userData.id : "";
  }
  const callCenterId = branchId;
  const [active, setActive] = useState(`/finance/salary/${callCenterId}`);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const handleCardClick = (event) => {
    event.preventDefault();
    navigate(`/`);
  };

  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }
    const worksRef = doc(collection(firestore, "finance"), user.uid);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(worksRef, (doc) => {
      if (doc.exists()) {
        // localStorage.setItem(
        //   "userData",
        //   JSON.stringify({
        //     ...doc.data(),
        //     id: doc.id,
        //   })
        // );
        if (doc.data().disable) {
          logout();
        }
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [user.uid]);
  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <div onClick={handleCardClick}>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      style={{ cursor: "pointer" }}
                    >
                      ETHIO DELIVERY
                    </Typography>
                  </div>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, path, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = path;
                let route = `/${lcText}/${callCenterId}`;
                console.log(route, active);

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(route);
                        setActive(route);
                      }}
                      sx={{
                        backgroundColor:
                          active === route
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === route
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === route
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === route && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default FinanceSidebar;
