import React, { useContext } from "react";
import {
  CardHeader,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  Tooltip,
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import getHumanReadableDate from "../../utils/humanReadableDate";
import useUserClaims from "../../hooks/useUserClaims";
import { useAuth } from "../../contexts/AuthContext";
import FlexBetween from "../VersatileComponents/FlexBetween";
import { useSnackbar } from "../../contexts/InfoContext";
import ChangeSheetStatus from "../../api/branch/changeSheetStatus";
import { SpinnerContext } from "../../contexts/SpinnerContext";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const BranchCardHeader = ({
  anchorEl,
  branchData,
  handleMenuOpen,
  handleMenuClose,
  handleCardClick,
  handleEdit,
  handleDeleteIconClick,
  typographyStyles,
}) => {
  const { name, uniqueName, openingDate, sheetStatus } = branchData;
  const humanReadableDate = getHumanReadableDate(openingDate);
  const theme = useTheme();
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  const { openSnackbar } = useSnackbar();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);

  const handleSheetStatusChange = async () => {
    if (!branchData.activeSheet) {
      openSnackbar(`${name} branch do not have active sheet.`, "info");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await ChangeSheetStatus(user, {
        branchId: branchData.id,
        previousActive: branchData.activeSheet,
        active: branchData.active,
      });
      openSnackbar(res.data.message, "success");
    } catch (error) {
      if (error.response && error.response.data) {
        openSnackbar(
          error.response.data.message,
          error.response.data.type ? error.response.data.type : "error"
        );
      } else {
        openSnackbar("An unexpected error occurred.", "error");
      }
    }
    setIsSubmitting(false);
  };

  // console.log(isLargeScreen, isMediumScreen, isSmallScreen);
  const { screenWidth, screenHeight } = useWindowDimensions();
  // console.log(screenWidth / 1536);
  const fontSize = screenWidth >= 1536 ? 18 : (screenWidth / 1536) * 18 + "px";
  return (
    <>
      <CardHeader
        action={
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {userClaims.superAdmin ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  style={{ color: theme.palette.secondary[100] }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                >
                  <MenuItem onClick={() => handleEdit(branchData)}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => handleDeleteIconClick()}>
                    Delete
                  </MenuItem>
                </Menu>
              </>
            ) : null}
          </div>
        }
        title={
          <FlexBetween>
            <Tooltip title={name}>
              <div onClick={handleCardClick}>
                <Typography
                  variant="h6"
                  fontSize={fontSize}
                  sx={{
                    color: "text.secondary",
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: screenWidth < 1250 ? "150px" : "100%",
                  }}
                  style={typographyStyles}
                >
                  {`${name} (${uniqueName})`}
                </Typography>
              </div>
            </Tooltip>

            {userClaims.finance && (
              <Chip
                label={sheetStatus}
                onClick={handleSheetStatusChange}
                disabled={sheetStatus === "Completed"}
                style={{
                  cursor: "pointer",
                  marginLeft: 10,
                  backgroundColor:
                    sheetStatus === "Completed" ? "green" : "red",
                  color: "white",
                }}
              />
            )}
          </FlexBetween>
        }
        subheader={humanReadableDate}
      />
    </>
  );
};

export default BranchCardHeader;
