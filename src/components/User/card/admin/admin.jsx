import * as React from "react";
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSnackbar } from "../../../../contexts/InfoContext";
import deleteUser from "../../../../api/users/delete";
import UserHeader from "./header";
import CustomEllipsisTextField from "../../../CustomComponents/CustomEllipsisTextField";
import EmergencyInformation from "../../common/EmergencyInformation";
import ConfirmationDialog from "../../../VersatileComponents/ConfirmationDialog";
import AdminEditForm from "../../editUserForm/admin";
import { SpinnerContext } from "../../../../contexts/SpinnerContext";
import { useContext } from "react";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const UserCard = ({ userInfo }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const { openSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleEdit = () => {
    setDialogOpen(true);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDeleteConfirmed = async () => {
    handleDialogClose();
    setIsSubmitting(true);
    try {
      const res = await deleteUser(user, userInfo.id, "admin");
      openSnackbar(res.data.message, "success");
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
    handleMenuClose();
  };

  return (
    <>
      <Card
        sx={{
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
          color: theme.palette.secondary[700],
          marginTop: "1rem",
          // maxWidth: 280,
        }}
      >
        <UserHeader
          userInfo={userInfo}
          anchorEl={anchorEl}
          handleMenuOpen={handleMenuOpen}
          handleMenuClose={handleMenuClose}
          handleEdit={handleEdit}
          handleDeleteIconClick={handleDeleteIconClick}
        />

        <CardContent>
          <CustomEllipsisTextField label="Phone" value={userInfo.phone} />
          <CustomEllipsisTextField label="Email" value={userInfo.email} />
          <CustomEllipsisTextField
            label="BankAccount"
            value={userInfo.bankAccount}
          />
          <CustomEllipsisTextField
            label="FullAddress"
            value={userInfo.fullAddress}
          />
          <CustomEllipsisTextField label="Branch" value={userInfo.branchName} />
        </CardContent>
        <CardActions disableSpacing>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <EmergencyInformation expanded={expanded} userInfo={userInfo} />
      </Card>
      {dialogOpen && (
        <AdminEditForm
          admin={userInfo}
          isEditDialogOpen={dialogOpen}
          closeEditDialog={() => setDialogOpen(false)}
        />
      )}
      <ConfirmationDialog
        open={openDialog}
        handleDialogClose={handleDialogClose}
        handleConfirmed={handleDeleteConfirmed}
        message={`Are you sure you want to delete this Branch Admin ?`}
        title={`Confirm Branch Admin deletion`}
      />
    </>
  );
};

export default UserCard;
