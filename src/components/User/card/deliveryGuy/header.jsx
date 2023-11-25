import React, { useContext } from "react";
import {
  CardHeader,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSnackbar } from "../../../../contexts/InfoContext";
import { SpinnerContext } from "../../../../contexts/SpinnerContext";
import updateProfileImage from "../../../../api/users/profileImageChange";
import ProfileImageDialog from "../../common/ProfileImageDialog";
import FlexBetween from "../../../VersatileComponents/FlexBetween";
import useUserClaims from "../../../../hooks/useUserClaims";
import getRequiredUserData from "../../../../utils/getBranchInfo";
import useScreenSize from "../../../../hooks/useScreenSize";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";

const UserHeader = ({
  userInfo,
  anchorEl,
  handleMenuOpen,
  handleMenuClose,
  handleEdit,
  handleDeleteIconClick,
  handleClick,
  handleSalaryPay,
  handleComplete,
}) => {
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const { setIsSubmitting } = useContext(SpinnerContext);
  const userClaims = useUserClaims(user);
  const branchData = getRequiredUserData();
  const handleImageSave = async (formData) => {
    setIsSubmitting(true);
    // Close the dialog after saving
    try {
      formData.append("collectionName", "deliveryguy");
      await updateProfileImage(user, userInfo.id, formData);
      openSnackbar("Profile image updated successfully.", "success");
      setIsDialogOpen(false);
    } catch (error) {
      if (error.response && error.response.data) {
        openSnackbar(
          error.response.data.message,
          error.response.data.type ? error.response.data.type : "error"
        );
      } else {
        openSnackbar(
          "An unexpected error occurred.Please kindly check your connection.",
          "error"
        );
      }
    }
    setIsSubmitting(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const { screenWidth } = useWindowDimensions();

  const avatarSize =
    screenWidth >= 1536 ? 50 : (screenWidth / 1536) * 50 + "px";
  const fontSize = screenWidth >= 1536 ? 18 : (screenWidth / 1536) * 18 + "px";

  return (
    <>
      <ProfileImageDialog
        imageUrl={userInfo.profileImage}
        open={isDialogOpen}
        onClose={closeDialog}
        onSave={handleImageSave}
      />
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: theme.palette.background.alt,
              cursor: "pointer",
              width: avatarSize,
              height: avatarSize,
            }}
            src={userInfo.profileImage}
            aria-label="members image"
            onClick={openDialog}
          >
            {userInfo.fullName.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          userClaims.admin ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
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
                {/* <MenuItem onClick={handleEdit}>Edit</MenuItem> */}
                <MenuItem onClick={handleEdit}>Edit</MenuItem>

                <MenuItem onClick={handleDeleteIconClick}>Delete</MenuItem>
                <MenuItem
                  onClick={handleSalaryPay}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: userInfo.paid ? "green" : "red",
                    color: "white",
                    margin: "3px",
                    "&:hover": {
                      backgroundColor: userInfo.paid ? "darkgreen" : "darkred",
                    },
                  }}
                  disabled={userInfo.paid || !branchData.active}
                >
                  {userInfo.paid ? "Paid" : "Waiting"}
                </MenuItem>
                <MenuItem
                  onClick={handleComplete}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "green",
                    color: "white",
                    margin: "3px",

                    "&:hover": {
                      backgroundColor: userInfo.completed
                        ? "darkgreen"
                        : "darkred",
                    },
                  }}
                  disabled={userInfo.completed || !branchData.active}
                >
                  {"Completed"}
                </MenuItem>
              </Menu>
            </div>
          ) : null
        }
        title={
          <FlexBetween>
            <Tooltip title={userInfo.fullName}>
              <Typography
                variant="h6"
                fontSize={fontSize}
                sx={{
                  color: "text.secondary",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100px",
                }}
              >
                {userInfo.fullName}
              </Typography>
            </Tooltip>
            <FlexBetween>
              {userClaims.admin ? (
                <Chip
                  label={userInfo.activeness ? "Active" : "Inactive"}
                  onClick={handleClick}
                  //   disabled={isSubmitting}
                  style={{
                    cursor: "pointer",
                    backgroundColor: userInfo.activeness ? "green" : "red",
                    color: "white",
                    width: "80px",
                    height: "30px",
                    fontSize: 10,
                  }}
                />
              ) : null}
            </FlexBetween>
          </FlexBetween>
        }
      />
    </>
  );
};

export default UserHeader;
