import React from "react";
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
// import ProfileImageDialog from "./ProfileImageDialog";
// import updateProfileImage from "../../api/services/Users/updateProfileImage";
// import enableDisable from "../../api/services/Users/handleEnableDisable";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSnackbar } from "../../../../contexts/InfoContext";
import updateProfileImage from "../../../../api/users/profileImageChange";
import enableDisable from "../../../../api/users/disable";
import LoadingSpinner from "../../../VersatileComponents/LoadingSpinner";
import ProfileImageDialog from "../../common/ProfileImageDialog";
import FlexBetween from "../../../VersatileComponents/FlexBetween";

const typographyStyles = {
  cursor: "pointer",
  transition: "font-size 0.2s ease-in-out",
  "&:hover": {
    fontSize: "1.2rem",
  },
};

const UserHeader = ({
  userInfo,
  anchorEl,
  handleMenuOpen,
  handleMenuClose,
  handleEdit,
  handleCardClick,
}) => {
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSave = async (formData) => {
    setIsSubmitting(true);
    // Close the dialog after saving
    try {
      formData.append("collectionName", "callcenter");
      await updateProfileImage(user, userInfo.id, formData);
      openSnackbar("Profile image updated successfully.", "success");
      setIsDialogOpen(false);
    } catch (error) {
      console.log(error);
      openSnackbar("Failed to update profile image.", "error");
    }
    setIsSubmitting(false);
  };

  const handleEnableDisable = async () => {
    setIsSubmitting(true);
    try {
      // console.log("user", userInfo.id);
      const res = await enableDisable(user, userInfo.id, {
        disable: !userInfo.disable,
        collectionName: "callcenter",
      });
      openSnackbar(res.data.message, "success");
    } catch (error) {
      console.log(error);
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
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
      <LoadingSpinner isSubmitting={isSubmitting} />
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
            src={userInfo.profileImage}
            aria-label="members image"
            onClick={openDialog}
          >
            {userInfo.fullName.charAt(0).toUpperCase()}
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
            </Menu>
          </div>
        }
        title={
          <FlexBetween>
            <div onClick={handleCardClick}>
              <Tooltip title={userInfo.fullName}>
                <Typography
                  variant="h6"
                  fontSize={18}
                  sx={{
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "200px", // Set a maximum width to control truncation
                    // "&:hover": {
                    //   maxWidth: "none", // Remove the maximum width on hover
                    // },
                  }}
                >
                  {userInfo.fullName}
                </Typography>
              </Tooltip>
            </div>
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
