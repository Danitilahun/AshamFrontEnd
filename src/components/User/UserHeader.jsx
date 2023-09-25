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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlexBetween from "../VersatileComponents/FlexBetween";
import { useState } from "react";
import ProfileImageDialog from "./ProfileImageDialog";
import { useAuth } from "../../contexts/AuthContext";
// import updateProfileImage from "../../api/services/Users/updateProfileImage";
import { useSnackbar } from "../../contexts/InfoContext";
// import enableDisable from "../../api/services/Users/handleEnableDisable";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import updateProfileImage from "../../api/users/profileImageChange";
import enableDisable from "../../api/users/disable";

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
  handleDeleteIconClick,
  userType,
  handleCardClick,
  handleClick,
  handleSalaryPay,
}) => {
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const handleImageSave = async (formData) => {
  //   setIsDialogOpen(false); // Close the dialog after saving
  //   try {
  //     console.log("user", userInfo.id);
  //     console.log("formdata", formData);
  //     await updateProfileImage(userType, user, userInfo.id, formData);
  //     openSnackbar("Profile image updated successfully.", "success");
  //   } catch (error) {
  //     console.log(error);
  //     openSnackbar("Failed to update profile image.", "error");
  //   }
  // };

  const handleImageSave = async (formData) => {
    setIsSubmitting(true);
    // Close the dialog after saving
    try {
      console.log("user", userInfo.id);
      console.log("formdata", formData);
      formData.append("collectionName", "admin");
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
        collectionName: "admin",
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
              <MenuItem onClick={handleDeleteIconClick}>Delete</MenuItem>
            </Menu>
          </div>
        }
        title={
          userType === "deliveryguy" ? (
            <FlexBetween>
              <Typography
                variant="h6"
                fontSize={18}
                sx={{ color: "text.secondary" }}
              >
                {userInfo.fullName}
              </Typography>
              <FlexBetween>
                <Chip
                  label={userInfo.activeness ? "Active" : "Inactive"}
                  onClick={handleClick}
                  //   disabled={isSubmitting}
                  style={{
                    cursor: "pointer",
                    backgroundColor: userInfo.activeness ? "green" : "red",
                    color: "white",
                  }}
                />

                <Chip
                  label={userInfo.paid ? "Compeleted" : "Waiting"}
                  onClick={handleSalaryPay}
                  disabled={userInfo.paid}
                  style={{
                    cursor: "pointer",
                    marginLeft: 10,
                    backgroundColor: userInfo.paid ? "green" : "red",
                    color: "white",
                  }}
                />
              </FlexBetween>
            </FlexBetween>
          ) : userType === "callcenter" ? (
            <div onClick={handleCardClick}>
              <Typography
                variant="h6"
                fontSize={18}
                sx={{ color: "text.secondary" }}
                style={typographyStyles}
              >
                {userInfo.fullName}
              </Typography>
            </div>
          ) : userType === "admin" ? (
            <FlexBetween>
              <Typography
                variant="h6"
                fontSize={18}
                sx={{ color: "text.secondary" }}
              >
                {userInfo.fullName}
              </Typography>

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
          ) : (
            <Typography
              variant="h6"
              fontSize={18}
              sx={{ color: "text.secondary" }}
            >
              {userInfo.fullName}
            </Typography>
          )
        }
      />
    </>
  );
};

export default UserHeader;
