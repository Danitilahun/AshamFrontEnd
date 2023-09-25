import React from "react";
import {
  Box,
  Drawer,
  Grid,
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FlexBetween from "../VersatileComponents/FlexBetween";
import PersonIcon from "@mui/icons-material/Person";
import SummarizeIcon from "@mui/icons-material/Summarize";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import { useBranch } from "../../contexts/BranchContext";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import useUserClaims from "../../hooks/useUserClaims";
import getRequiredUserData from "../../utils/getBranchInfo";
const navItems = [
  {
    text: "Asbeza",
    path: "service/asbeza",
    icon: <PersonIcon />,
  },
  {
    text: "Card",
    path: "service/card",
    icon: <SummarizeIcon />,
  },
  {
    text: "Water",
    path: "service/water",
    icon: <Money />,
  },
  {
    text: "Wifi",
    path: "service/wifi",
    icon: <MiscellaneousServicesIcon />,
  },
];

const ServiceSidebar = ({
  currentUser,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  // const { callCenterId } = useBranch();
  const params = useParams();
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  const callcenterData = getRequiredUserData();
  const callCenterId = userClaims.callCenter
    ? user.uid
    : callcenterData.requiredId;
  const [active, setActive] = useState(`/service/asbeza/${callCenterId}`);
  const navigate = useNavigate();
  const theme = useTheme();
  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const handleCardClick = (event) => {
    event.preventDefault();
    navigate(`/`);
  };

  const { logout } = useAuth();

  useEffect(() => {
    if (!user && !callCenterId) {
      return;
    }
    const worksRef = doc(
      collection(firestore, "callcenter"),
      userClaims.callCenter ? user.uid : callCenterId ? callCenterId : params.id
    );

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
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [callCenterId]);

  useEffect(() => {
    if (!userClaims.callCenter && !user && !user.uid) {
      return; // Add a check for user and user.uid
    }
    const worksRef = doc(collection(firestore, "callcenter"), user.uid);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(worksRef, (doc) => {
      if (doc.exists()) {
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
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap="0.5rem"
                  flexDirection="row"
                  m="0 30"
                >
                  <div onClick={handleCardClick}>
                    <Grid
                      container
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item xs={4}></Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="h3"
                          fontWeight="bold"
                          style={{ cursor: "pointer" }}
                        >
                          ASHAM
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        {/* <img
                          width={"50px"}
                          height={"50px"}
                          src="/assets/delivery.png" // Replace with the actual image source
                          alt="Image Alt Text" // Provide alt text for accessibility
                          style={{ marginRight: "10px", cursor: "pointer" }} // Add some margin for spacing
                        /> */}
                      </Grid>
                    </Grid>
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

export default ServiceSidebar;
