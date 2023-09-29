import React, { useContext, useEffect, useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
  Paper,
} from "@mui/material";
import { useCustomTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useBranch } from "../../contexts/BranchContext";
import EssentialComponent from "../Essential/EssentialComponent";

const Navbar = ({
  currentUser,
  isSidebarOpen,
  setIsSidebarOpen,
  from = "other",
}) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const { toggleMode } = useCustomTheme();
  const { logout, user } = useAuth();

  const { branchName, branchInfo, sheetName, callCenterName } = useBranch();
  const [userClaims, setUserClaims] = useState({});
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const toggleButton = () => {
    setIsButtonVisible(!isButtonVisible);
  };

  // ... (other states)

  // Use useEffect to fetch idTokenResult when the component mounts
  useEffect(() => {
    async function fetchUserClaims() {
      try {
        const idTokenResult = await user.getIdTokenResult();
        setUserClaims(idTokenResult.claims);
      } catch (error) {
        console.log("Error fetching user claims:", error);
      }
    }
    fetchUserClaims();
  }, [user]);

  console.log("user claim", userClaims.superAdmin === true);
  console.log("the sheet name is ", sheetName);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Call your logout function from the useAuth context
    } catch (error) {
      console.log("Logout failed: ", error);
    }
  };

  const handleCardClick = (event) => {
    event.preventDefault();
    navigate(`/`);
  };
  const handleSetting = (event) => {
    event.preventDefault();
    navigate(`/setting`);
  };

  return (
    <>
      <AppBar
        sx={{
          position: "static",
          background: "none",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LEFT SIDE */}
          <FlexBetween>
            {from !== "table" ? (
              <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <MenuIcon />
              </IconButton>
            ) : (
              <Box display="flex" alignItems="center" gap="0.5rem">
                <div onClick={handleCardClick}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={theme.palette.secondary.main}
                    style={{ cursor: "pointer" }}
                  >
                    ASHAM
                  </Typography>
                </div>
              </Box>
            )}
            <FlexBetween
              backgroundColor={theme.palette.background.alt}
              borderRadius="9px"
              gap="3rem"
              p="0.1rem 1.5rem"
              style={{ marginLeft: "10px" }}
            >
              {callCenterName ||
                (branchName && (
                  <Typography
                    variant="h6"
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    {from === "callcenter"
                      ? callCenterName
                      : branchName
                      ? branchName
                      : ""}
                    {/* {branchName} {sheetName && `/ ${sheetName} `} */}
                  </Typography>
                ))}
            </FlexBetween>
          </FlexBetween>

          {/* RIGHT SIDE */}
          <FlexBetween gap="1.5rem">
            <Button color="inherit" onClick={toggleButton}>
              Essentials
            </Button>
            <IconButton onClick={() => toggleMode()}>
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlined sx={{ fontSize: "25px" }} />
              ) : (
                <LightModeOutlined sx={{ fontSize: "25px" }} />
              )}
            </IconButton>
            {userClaims.superAdmin ? (
              <IconButton onClick={handleSetting}>
                <SettingsOutlined sx={{ fontSize: "25px" }} />
              </IconButton>
            ) : (
              <div></div>
            )}

            <FlexBetween>
              <Button
                onClick={handleClick}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textTransform: "none",
                  gap: "1rem",
                }}
              >
                <Box
                  component="img"
                  alt="profile"
                  src={
                    currentUser.profileImage
                      ? currentUser.profileImage
                      : "/assets/avator.jpg"
                  }
                  height="32px"
                  width="32px"
                  borderRadius="50%"
                  sx={{ objectFit: "cover" }}
                />
                <Box textAlign="left">
                  <Typography
                    fontWeight="bold"
                    fontSize="0.85rem"
                    sx={{ color: theme.palette.secondary[100] }}
                  >
                    {currentUser.fullName}
                  </Typography>
                </Box>
                <ArrowDropDownOutlined
                  sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
                />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
            </FlexBetween>
          </FlexBetween>
        </Toolbar>
      </AppBar>
      <EssentialComponent isVisible={isButtonVisible} />
    </>
  );
};

export default Navbar;
