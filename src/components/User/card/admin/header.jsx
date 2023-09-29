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
import updateProfileImage from "../../../../api/users/profileImageChange";
import enableDisable from "../../../../api/users/disable";
import ProfileImageDialog from "../../common/ProfileImageDialog";
import FlexBetween from "../../../VersatileComponents/FlexBetween";
import { SpinnerContext } from "../../../../contexts/SpinnerContext";

const UserHeader = ({
  userInfo,
  anchorEl,
  handleMenuOpen,
  handleMenuClose,
  handleEdit,
  handleDeleteIconClick,
}) => {
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);

  const handleImageSave = async (formData) => {
    setIsSubmitting(true);
    try {
      formData.append("collectionName", "admin");
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
        openSnackbar("An unexpected error occurred.", "error");
      }
    }
    setIsSubmitting(false);
  };

  const handleEnableDisable = async () => {
    setIsSubmitting(true);
    try {
      const res = await enableDisable(user, userInfo.id, {
        disable: !userInfo.disable,
        collectionName: "admin",
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

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };
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
            sx={{ bgcolor: theme.palette.background.alt, cursor: "pointer" }}
            src={userInfo?.profileImage}
            aria-label="members image"
            onClick={openDialog}
          >
            {userInfo?.fullName
              ? userInfo.fullName.charAt(0).toUpperCase()
              : ""}
          </Avatar>
        }
        action={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "5px",
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
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDeleteIconClick}>Delete</MenuItem>
            </Menu>
          </div>
        }
        title={
          <FlexBetween>
            <Tooltip title={userInfo.fullName}>
              <Typography
                variant="h6"
                fontSize={18}
                sx={{
                  color: "text.secondary",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "150px", // Set a maximum width to control truncation
                  // "&:hover": {
                  //   maxWidth: "none", // Remove the maximum width on hover
                  // },
                }}
              >
                {userInfo.fullName}
              </Typography>
            </Tooltip>

            <Chip
              label={Boolean(userInfo.disable) ? "Disable" : "Enabled"}
              onClick={handleEnableDisable}
              // disabled={userInfo.paid}
              style={{
                cursor: "pointer",
                marginLeft: 10,
                backgroundColor: !userInfo.disable ? "green" : "red",
                color: "white",
              }}
            />
          </FlexBetween>
        }
      />
    </>
  );
};

export default UserHeader;
