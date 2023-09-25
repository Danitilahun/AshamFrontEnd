import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Input from "@mui/material/Input";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material";

import { useSnackbar } from "../../contexts/InfoContext";

const ProfileImageDialog = ({ imageUrl, open, onClose, onSave }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const { openSnackbar } = useSnackbar();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSave = () => {
    console.log("selectedImage", selectedImage);
    if (!selectedImage) {
      openSnackbar("Please select an image.", "info");
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }
    const formData = new FormData();
    formData.append("profileImage", selectedImage);
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    // Clear the file input value when Cancel is clicked
    fileInputRef.current.value = "";
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle
        sx={{
          textAlign: "center",
          backgroundColor: theme.palette.background.alt,
        }}
      >
        Change Profile Image
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          backgroundColor: theme.palette.background.alt,
        }}
      >
        {imagePreview ? (
          <Avatar
            alt="Profile Preview"
            src={imagePreview}
            sx={{ width: 150, height: 150 }}
          />
        ) : (
          <Avatar
            alt="Profile"
            src={imageUrl}
            sx={{ width: 150, height: 150 }}
          />
        )}
        <DialogContentText sx={{ textAlign: "center", marginTop: "10px" }}>
          Select a new image for your profile.
        </DialogContentText>
        <label
          htmlFor="image-input"
          style={{
            cursor: "pointer",
            color: "black",
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#f9f9f9",
            transition: "background-color 0.3s ease",
          }}
        >
          Upload Image
        </label>
        <Input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          ref={fileInputRef} // Assign the ref to the file input
        />
      </DialogContent>
      <DialogActions sx={{ backgroundColor: theme.palette.background.alt }}>
        <Button
          onClick={handleCancel}
          backgroundColor={theme.palette.background.alt}
          sx={{
            color: theme.palette.secondary[100],
            "&:hover": {
              backgroundColor: "white",
              color: "black",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          backgroundColor={theme.palette.background.alt}
          sx={{
            color: theme.palette.secondary[100],
            "&:hover": {
              backgroundColor: "white",
              color: "black",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileImageDialog;
