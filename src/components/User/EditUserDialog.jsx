import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  DialogActions,
  useTheme,
} from "@mui/material";
import CustomEditTextField from "../CustomComponents/CustomEditTextField";

const EditUserDialog = ({
  dialogOpen,
  setDialogOpen,
  handleEditSubmit,
  editFormValues,
  setEditFormValues,
  usertype,
}) => {
  const theme = useTheme();
  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleEditSubmit}>
          {/* Other Input Fields */}
          <Grid container spacing={2}>
            <CustomEditTextField
              name="fullName"
              label="Full Name"
              value={editFormValues.fullName}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  fullName: e.target.value,
                })
              }
            />
            <CustomEditTextField
              name="phone"
              label="Phone"
              value={editFormValues.phone}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  phone: e.target.value,
                })
              }
            />

            {usertype === "deliveryguy" ? (
              <div></div>
            ) : (
              <CustomEditTextField
                name="email"
                label="Email"
                value={editFormValues.email}
                onChange={(e) =>
                  setEditFormValues({
                    ...editFormValues,
                    email: e.target.value,
                  })
                }
              />
            )}
            <CustomEditTextField
              name="bankAccount"
              label="BankAccount"
              type={"number"}
              value={editFormValues.bankAccount}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  bankAccount: e.target.value,
                })
              }
            />
            <CustomEditTextField
              name="fullAddress"
              label="FullAddress"
              value={editFormValues.fullAddress}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  fullAddress: e.target.value,
                })
              }
            />
            <CustomEditTextField
              name="securityName"
              label="SecurityName"
              value={editFormValues.securityName}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  securityName: e.target.value,
                })
              }
            />
            <CustomEditTextField
              name="securityAddress"
              label="SecurityAddress"
              value={editFormValues.securityAddress}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  securityAddress: e.target.value,
                })
              }
            />
            <CustomEditTextField
              name="securityPhone"
              label="SecurityPhone"
              value={editFormValues.securityPhone}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  securityPhone: e.target.value,
                })
              }
            />

            <Grid item xs={12} container alignItems="end" justifyContent="end">
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={() => setDialogOpen(false)}
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
                  variant="contained"
                  type="submit"
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

export default EditUserDialog;
