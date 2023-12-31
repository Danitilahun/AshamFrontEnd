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
import PeopleIcon from "@mui/icons-material/People";
import { ChevronLeft, ChevronRightOutlined, Money } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SummarizeIcon from "@mui/icons-material/Summarize";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import { useBranch } from "../../contexts/BranchContext";
import WaterIcon from "@mui/icons-material/Water";
import WifiIcon from "@mui/icons-material/Wifi";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import FlexBetween from "../VersatileComponents/FlexBetween";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalculateIcon from "@mui/icons-material/Calculate";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import getRequiredUserData from "../../utils/getBranchInfo";
import useUserClaims from "../../hooks/useUserClaims";
import NetworkWifiIcon from "@mui/icons-material/NetworkWifi";
import LocationCityIcon from "@mui/icons-material/LocationCity";
const navItems = [
  {
    text: "Delivery Guy",
    path: "deliveryguy",
    icon: <PersonIcon />,
  },
  {
    text: "Staff",
    path: "staff",
    icon: <Diversity3Icon />,
  },
  {
    text: "Daily Report",
    path: "dailyreport",
    icon: <SummarizeIcon />,
    subItems: [
      {
        text: "Card Fee",
        path: "cardfee",
        icon: <SummarizeIcon />,
      },
      {
        text: "Card Distribute",
        path: "carddistribute",
        icon: <PersonIcon />,
      },
      {
        text: "Wifi Distribute",
        path: "wifidistribute",
        icon: <NetworkWifiIcon />,
      },
      {
        text: "Water Distribute",
        path: "waterdistribute",
        icon: <WaterIcon />,
      },
      {
        text: "Hotel Profit",
        path: "hotelprofit",
        icon: <LocationCityIcon />,
      },
    ],
  },
  {
    text: "Money",
    path: "money",
    icon: <Money />,
    subItems: [
      {
        text: "Budget",
        path: "budget",
        icon: <SummarizeIcon />,
      },
      {
        text: "Transaction",
        path: "transaction",
        icon: <PersonIcon />,
      },
      {
        text: "Credit",
        path: "credit",
        icon: <Money />,
        subSubItems: [
          {
            text: "Daily Credit",
            path: "dailycredit",
            icon: <Money />,
          },
          {
            text: "Staff Credit",
            path: "staffcredit",
            icon: <Money />,
          },
          {
            text: "Customer Credit",
            path: "customercredit",
            icon: <Money />,
          },
        ],
      },
      {
        text: "Salary",
        path: "salary",
        icon: <MiscellaneousServicesIcon />,
      },
      {
        text: "Bonus/Penality",
        path: "bonuspenality",
        icon: <MiscellaneousServicesIcon />,
      },
    ],
  },
  {
    text: "Service",
    path: "service",
    icon: <MiscellaneousServicesIcon />,
    subItems: [
      {
        text: "Asbeza",
        path: "asbeza",
        icon: <LocalDiningIcon />,
      },
      {
        text: "Wifi",
        path: "wifi",
        icon: <WifiIcon />,
      },
      {
        text: "Water",
        path: "water",
        icon: <WaterIcon />,
      },
      {
        text: "Card",
        path: "card",
        icon: <CreditCardIcon />,
      },
    ],
  },
  {
    text: "Customer",
    path: "segmentCustomer",
    icon: <PeopleIcon />,
  },
  {
    text: "Bank",
    path: "bank",
    icon: <AccountBalanceIcon />,
  },
  {
    text: "Calculator",
    path: "calculator",
    icon: <CalculateIcon />,
  },
];

const BranchSidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { user, logout } = useAuth();
  const userClaims = useUserClaims(user);
  const { pathname } = useLocation();
  const params = useParams();
  const branchData = getRequiredUserData();
  const branchId = branchData.requiredId;

  useEffect(() => {
    if (!branchId) {
      return; // Add a check for branchId
    }
    const worksRef = doc(collection(firestore, "branches"), branchId);
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

    return () => unsubscribe();
  }, [branchId]);

  useEffect(() => {
    if (!userClaims.admin || !user || !user.uid) {
      return; // Add a check for user and user.uid
    }
    const worksRef = doc(collection(firestore, "admin"), user.uid);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(worksRef, (doc) => {
      if (doc.exists()) {
        if (doc.data().disable) {
          logout();
        }
      } else {
        logout();
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [user.uid, userClaims.admin]);

  useEffect(() => {
    if (!userClaims.admin && !user && !user.uid) {
      return; // Add a check for user and user.uid
    }
    if (user.displayName === "") {
      logout();
    }
  }, [user.uid]);

  const [active, setActive] = useState(
    `deliveryguy/${branchId ? branchId : params.id}`
  );
  const [activeMenu, setActiveMenu] = useState(
    `deliveryguy/${branchId ? branchId : params.id}`
  );

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (params.id === "null") {
      const pathnameSegments = pathname.split("/");

      // Filter out 'null' segments
      const filteredSegments = pathnameSegments.filter(
        (segment) => segment !== "null"
      );
      // Join the filtered segments back together
      const newPathname = filteredSegments.join("/");
      setActive(`${newPathname}/${branchId}`);
      navigate(`${newPathname}/${branchId}`);
    } else {
      setActive(pathname);
    }
  }, [pathname]);

  const handleCardClick = (event) => {
    event.preventDefault();
    navigate(`/`);
  };

  return (
    <Box component="nav" style={{ zIndex: 100 }}>
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
              boxSizing: "border-box",
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
                      marginLeft={1}
                    >
                      <Grid item xs={12}>
                        <Typography
                          variant="h3"
                          fontWeight="bold"
                          style={{ cursor: "pointer" }}
                        >
                          ASHAM LOLE
                        </Typography>
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
              {navItems.map(({ text, path, icon, subItems }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = path;
                let route = `/${lcText}/${branchId}`;

                return (
                  <React.Fragment key={text}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          if (subItems) {
                            setActiveMenu(active === route ? null : route); // always keep track of the active menu item
                            setActive(active === route ? null : route); // toggle active item for collapse/expand behavior
                          } else {
                            navigate(route);
                            setActiveMenu(route); // here, menu item is also the active route
                          }
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
                          paddingLeft:
                            subItems && active === `/${lcText}/${branchId}`
                              ? "2rem"
                              : "2rem",
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
                        {subItems && (
                          <ChevronRightOutlined
                            sx={{
                              ml: "auto",
                              transform:
                                active === route
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                            }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                    {subItems && (active === route || activeMenu === route) && (
                      <List sx={{ paddingLeft: "2rem" }}>
                        {subItems.map(({ text, path, icon }) => {
                          const lcSubText = path;
                          const subRoute = `/${lcSubText}/${branchId}`;

                          return (
                            <ListItem key={text} disablePadding>
                              <ListItemButton
                                onClick={() => {
                                  navigate(subRoute);
                                  setActive(subRoute);
                                }}
                                sx={{
                                  paddingLeft: "2rem", // Indent sub-items under "Money" and "Service"
                                  backgroundColor:
                                    active === subRoute
                                      ? theme.palette.secondary[300]
                                      : "transparent",
                                  color:
                                    active === subRoute
                                      ? theme.palette.primary[600]
                                      : theme.palette.secondary[100],
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    ml: "2rem",
                                    color:
                                      active === subRoute
                                        ? theme.palette.primary[600]
                                        : theme.palette.secondary[200],
                                  }}
                                >
                                  {icon}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                                {active === subRoute && (
                                  <ChevronRightOutlined sx={{ ml: "auto" }} />
                                )}
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default BranchSidebar;
