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
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import {
  ChevronLeft,
  ChevronRightOutlined,
  Groups2Outlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../VersatileComponents/FlexBetween";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PaidIcon from "@mui/icons-material/Paid";
import PeopleIcon from "@mui/icons-material/People";
import { useBranch } from "../../contexts/BranchContext";

const navItems = [
  //   {
  //     text: "Dashboard",
  //     icon: <DashboardIcon />,
  //   },
  //   {
  //     text: "Information",
  //     icon: null,
  //   },
  {
    text: "Branch",
    icon: <AccountTreeIcon />,
  },
  {
    text: "Admin",
    icon: <Groups2Outlined />,
  },
  {
    text: "CallCenter",
    icon: <ContactPhoneIcon />,
  },
  {
    text: "Finance",
    icon: <PaidIcon />,
  },
  {
    text: "Customer",
    icon: <PeopleIcon />,
  },

  //   {
  //     text: "Setting",
  //     icon: null,
  //   },
  //   {
  //     text: "Profile",
  //     icon: <AdminPanelSettingsOutlined />,
  //   },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const handleCardClick = (event) => {
    event.preventDefault();
    navigate(`/`);
  };
  localStorage.setItem("userData", JSON.stringify({}));
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
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* <Box position="absolute" bottom="2rem">
            <Divider />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              <Box
                component="img"
                alt="profile"
                src={user.profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.fullName}
                </Typography>
                
              </Box>
              <SettingsOutlined
                sx={{
                  color: theme.palette.secondary[300],
                  fontSize: "25px ",
                }}
              />
            </FlexBetween>
          </Box> */}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
