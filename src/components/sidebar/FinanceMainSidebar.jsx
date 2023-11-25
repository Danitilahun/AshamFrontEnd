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
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { useAuth } from "../../contexts/AuthContext";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import useUserClaims from "../../hooks/useUserClaims";
import getRequiredUserData from "../../utils/getBranchInfo";
const navItems = [
  {
    text: "Branches",
    path: "mainFinance/branches",
    icon: <PersonIcon />,
  },
  {
    text: "Expenses",
    path: "mainFinance/expenses",
    icon: <SummarizeIcon />,
  },
  {
    text: "Bank",
    path: "mainFinance/bank",
    icon: <AccountBalanceIcon />,
  },
  {
    text: "Credit",
    path: "mainFinance/credit",
    icon: <CreditCardIcon />,
  },
];

const FinanceMainSidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  const financeData = getRequiredUserData();
  const params = useParams();
  let callCenterId = userClaims.finance ? user.uid : financeData.requiredId;
  callCenterId = userClaims.superAdmin ? params.id : callCenterId;
  const [active, setActive] = useState(
    `/mainFinance/branches/${callCenterId}}`
  );
  const navigate = useNavigate();
  const theme = useTheme();

  const { logout } = useAuth();

  useEffect(() => {
    if (!user && !callCenterId) {
      return;
    }
    const worksRef = doc(
      collection(firestore, "finance"),
      userClaims.finance ? user.uid : callCenterId ? callCenterId : params.id
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
        if (doc.data().disable) {
          logout();
        }
      }
    });
    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [callCenterId]);

  useEffect(() => {
    if (!userClaims.finance || !user || !user.uid) {
      return; // Add a check for user and user.uid
    }

    const worksRef = doc(collection(firestore, "finance"), user.uid);

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

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const handleCardClick = (event) => {
    event.preventDefault();
    navigate(`/`);
  };

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
                      // marginLeft={1}
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
              {navItems.map(({ text, path, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = path;
                let route = `/${lcText}/${
                  userClaims.finance
                    ? user.uid
                    : callCenterId
                    ? callCenterId
                    : params.id
                }`;

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

export default FinanceMainSidebar;
