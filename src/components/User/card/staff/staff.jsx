import * as React from "react";
import { useContext } from "react";
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
import { SpinnerContext } from "../../../../contexts/SpinnerContext";
import deleteUser from "../../../../api/users/delete";
import UserHeader from "./header";
import CustomEllipsisTextField from "../../../CustomComponents/CustomEllipsisTextField";
import EmergencyInformation from "../../common/EmergencyInformation";
import StaffEditForm from "../../editUserForm/staff";
import ConfirmationDialog from "../../../VersatileComponents/ConfirmationDialog";
import getRequiredUserData from "../../../../utils/getBranchInfo";
import handleStaffPayUnpay from "../../../../api/users/handleStaffPayUnpay";
import useUserClaims from "../../../../hooks/useUserClaims";

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
  const branchData = getRequiredUserData();
  const userClaims = useUserClaims(user);
  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };

  const handleSalaryPay = async () => {
    if (!branchData.active) {
      openSnackbar(
        `Sorry , you can't ${
          !userInfo.paid ? "pay" : "unpay"
        } , since there is no salary table.`,
        "info"
      );
      return;
    }
    setIsSubmitting(true);

    try {
      if (!branchData.requiredId) {
        throw {
          response: {
            data: {
              message:
                "Calculator information is not found. Please check your connection, refresh your browser, and try again.",
              type: "error",
            },
          },
        };
      }

      if (!branchData.active) {
        throw {
          response: {
            data: {
              message:
                "Sorry, we cannot process your payment at the moment because the salary table is unavailable.",
              type: "error",
            },
          },
        };
      }
      await handleStaffPayUnpay(userInfo.id, user, {
        paid: !userInfo.paid,
        active: branchData.active,
        branchId: branchData.requiredId,
        salary: parseInt(userInfo.salary),
      });
      openSnackbar(`${userInfo.fullName} paid successfully!`, "success");
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
      const res = await deleteUser(user, userInfo.id, "staff");
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
        }}
      >
        <UserHeader
          userInfo={userInfo}
          anchorEl={anchorEl}
          handleMenuOpen={handleMenuOpen}
          handleMenuClose={handleMenuClose}
          handleEdit={handleEdit}
          handleDeleteIconClick={handleDeleteIconClick}
          handleSalaryPay={handleSalaryPay}
        />

        <CardContent>
          <CustomEllipsisTextField label="Phone" value={userInfo.phone} />
          <CustomEllipsisTextField
            label="BankAccount"
            value={userInfo.bankAccount}
          />
          <CustomEllipsisTextField
            label="FullAddress"
            value={userInfo.fullAddress}
          />
          <CustomEllipsisTextField label="Salary" value={userInfo.salary} />
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
        <StaffEditForm
          staff={userInfo}
          isEditDialogOpen={dialogOpen}
          closeEditDialog={() => setDialogOpen(false)}
        />
      )}
      <ConfirmationDialog
        open={openDialog}
        handleDialogClose={handleDialogClose}
        handleConfirmed={handleDeleteConfirmed}
        message={`Are you sure you want to delete this Staff ?`}
        title={`Confirm  Staff deletion`}
      />
    </>
  );
};

export default UserCard;
