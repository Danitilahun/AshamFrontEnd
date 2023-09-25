import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Avatar,
  MenuItem,
  Grid,
  useTheme,
  DialogActions,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CustomTextField from "../CustomComponents/CustomTextField";
import { useLocation } from "react-router-dom";

const RegistrationForm = ({
  showForm,
  handleCloseForm,
  handleSubmit,
  imagePreview,
  handleImageChange,
  branch,
  usertype,
}) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  return (
    <Dialog open={showForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
      <DialogTitle>New User</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Avatar and File Input */}
            <Grid
              item
              xs={12}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                {imagePreview ? (
                  <Avatar src={imagePreview} sx={{ width: 100, height: 100 }} />
                ) : (
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      backgroundColor: theme.palette.secondary[100],
                    }}
                  >
                    <AddPhotoAlternateIcon />
                  </Avatar>
                )}
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <label
                htmlFor="profileImage"
                style={{
                  backgroundColor: theme.palette.background.alt,
                  padding: "10px 15px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  display: "block",
                  width: "200px",
                  margin: "0 auto",
                  textAlign: "center",
                }}
              >
                Choose a profile image
              </label>
              <TextField
                type="file"
                name="profileImage"
                id="profileImage"
                accept="image/*"
                variant="outlined"
                fullWidth
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </Grid>

            <CustomTextField name="fullName" label="Full Name" />
            <CustomTextField name="phone" label="Phone" />

            {/* Branch */}
            {usertype === "Delivery Guy" ||
            usertype === "Call Center" ||
            usertype === "Staff" ||
            usertype === "Finance" ? (
              <div></div>
            ) : (
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  select
                  name="branch"
                  variant="outlined"
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      marginTop: "8px",
                      color: theme.palette.secondary[100],
                    },
                  }}
                  label="Branch"
                >
                  {branch.map((branch) => (
                    <MenuItem key={branch} value={branch[1]}>
                      {branch[0]}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {usertype === "Delivery Guy" || usertype === "Staff" ? (
              <div></div>
            ) : (
              <CustomTextField name="email" label="Email" type={"email"} />
            )}
            <CustomTextField
              name="bankAccount"
              label="Bank Account"
              type={"number"}
            />
            <CustomTextField name="fullAddress" label="Full Address" />
            <CustomTextField name="securityName" label="Security Name" />
            <CustomTextField name="securityAddress" label="Security Address" />
            <CustomTextField name="securityPhone" label="Security Phone" />
            {usertype === "Staff" && (
              <CustomTextField name="salary" label="Salary" />
            )}
            {usertype === "Staff" ? (
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  select
                  name="role"
                  variant="outlined"
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      marginTop: "8px",
                      color: theme.palette.secondary[100],
                    },
                  }}
                  label="Role"
                >
                  <MenuItem value="Cleaner">Cleaner</MenuItem>
                  <MenuItem value="Keeper">Keeper</MenuItem>
                  <MenuItem value="Bike Technician">Bike Technician</MenuItem>
                  <MenuItem value="Wifi Technician">Wifi Technician</MenuItem>
                </TextField>
              </Grid>
            ) : (
              <div></div>
            )}
            {usertype === "Finance" && (
              <CustomTextField name="budget" label="Budget" />
            )}
            <Grid item xs={12} container alignItems="end" justifyContent="end">
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={handleCloseForm}
                  sx={{
                    color: theme.palette.secondary[100],
                    "&:hover": {
                      backgroundColor: theme.palette.background.alt,
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    color: theme.palette.secondary[100],
                    "&:hover": {
                      backgroundColor: theme.palette.background.alt,
                    },
                  }}
                >
                  Submit
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationForm;
