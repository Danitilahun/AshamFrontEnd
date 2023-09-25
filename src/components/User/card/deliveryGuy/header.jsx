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
import { useAuth } from "../../../../contexts/AuthContext";
import { useSnackbar } from "../../../../contexts/InfoContext";
import updateProfileImage from "../../../../api/users/profileImageChange";
import LoadingSpinner from "../../../VersatileComponents/LoadingSpinner";
import ProfileImageDialog from "../../common/ProfileImageDialog";
import FlexBetween from "../../../VersatileComponents/FlexBetween";

const UserHeader = ({
  userInfo,
  anchorEl,
  handleMenuOpen,
  handleMenuClose,
  handleEdit,
  handleDeleteIconClick,
  handleClick,
  handleSalaryPay,
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
      formData.append("collectionName", "deliveryguy");
      await updateProfileImage(user, userInfo.id, formData);
      openSnackbar("Profile image updated successfully.", "success");
      setIsDialogOpen(false);
    } catch (error) {
      console.log(error);
      openSnackbar("Failed to update profile image.", "error");
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
                  maxWidth: "200px", // Set a maximum width to control truncation
                  // "&:hover": {
                  //   maxWidth: "none", // Remove the maximum width on hover
                  // },
                }}
              >
                {userInfo.fullName}
              </Typography>
            </Tooltip>
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
                label={userInfo.paid ? "Paid" : "Waiting"}
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
        }
      />
    </>
  );
};

export default UserHeader;
