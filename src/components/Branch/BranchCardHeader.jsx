import React from "react";
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
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import { useSnackbar } from "../../contexts/InfoContext";
import { useState } from "react";
import ChangeSheetStatus from "../../api/branch/changeSheetStatus";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      });
      openSnackbar(res.data.message, "success");
    } catch (error) {
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
    }
    setIsSubmitting(false);
  };
  return (
    <>
      <LoadingSpinner isSubmitting={isSubmitting} />
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
                  fontSize={18}
                  sx={{
                    color: "text.secondary",
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "150px",
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
