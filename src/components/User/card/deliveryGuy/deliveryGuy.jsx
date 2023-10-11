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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DeliveryGuyEditForm from "../../editUserForm/deliveryGuy";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSnackbar } from "../../../../contexts/InfoContext";
import deleteUser from "../../../../api/users/delete";
import LoadingSpinner from "../../../VersatileComponents/LoadingSpinner";
import UserHeader from "./header";
import CustomEllipsisTextField from "../../../CustomComponents/CustomEllipsisTextField";
import EmergencyInformation from "../../common/EmergencyInformation";
import ConfirmationDialog from "../../../VersatileComponents/ConfirmationDialog";
import { useBranch } from "../../../../contexts/BranchContext";
import handleDeliveryGuyActiveness from "../../../../api/users/handleDeliveryGuyActiveness";
import handlePay from "../../../../api/users/handleDeliveruGuyPay";
import getRequiredUserData from "../../../../utils/getBranchInfo";
import useUserClaims from "../../../../hooks/useUserClaims";
import { SpinnerContext } from "../../../../contexts/SpinnerContext";
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
  console.log("user info", userInfo);
  const theme = useTheme();
  const { user, forgotPassword } = useAuth();
  const userClaims = useUserClaims(user);
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const { selectedItemId, selectedItem } = useSelector(
    (state) => state.itemDetails
  );

  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    changeBranch,
    changeBranchName,
    changecallCenterId,
    changecallCenterName,
  } = useBranch();
  const branchData = getRequiredUserData();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);

  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };

  const handleOpen = () => {
    setOpenDialog3(true);
  };
  const handleEdit = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handlepayment = () => {
    if (branchData.paid) {
      setOpenDialog3(true);
    } else {
      setOpenDialog2(true);
    }
  };
  const handleDialogClose2 = () => {
    setOpenDialog2(false);
  };
  const handleDialogClose3 = () => {
    setOpenDialog3(false);
  };

  const handleCardClick = (event) => {
    event.preventDefault();
    changeBranchName("");
    changeBranch("");
    changecallCenterId(userInfo.id);
    changecallCenterName(userInfo.fullName);
    navigate(`/service/asbeza/${userInfo.id}`);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = async () => {
    setIsSubmitting(true);
    const activeData = {
      deliveryManId: userInfo.id,
      deliveryGuyName: userInfo.fullName,
      branchId: userInfo.branchId,
      active: !userInfo.activeness,
      activeSheetTable: branchData.active,
    };

    try {
      console.log("activeData", activeData);
      const res = await handleDeliveryGuyActiveness(activeData, user);
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
  };

  const handleSalaryPay = async () => {
    if (!branchData.active) {
      openSnackbar(
        "Sorry, we cannot process your payment at the moment because the salary table is unavailable.",
        "info"
      );
      return;
    }
    handleDialogClose2();
    handleDialogClose3();
    setIsSubmitting(true);

    try {
      const res = await handlePay(branchData.active, userInfo.id, user, {
        branchId: branchData.requiredId,
        paid: branchData.paid,
      });
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
      const res = await deleteUser(user, userInfo.id, "deliveryGuy");
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
          handleDeleteIconClick={handleDeleteIconClick}
          handleCardClick={handleCardClick}
          handleClick={handleClick}
          handleSalaryPay={handlepayment}
          handleEdit={handleEdit}
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
          <CustomEllipsisTextField
            label="Daily Credit"
            value={userInfo.dailyCredit}
          />
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
        <DeliveryGuyEditForm
          deliveryguy={userInfo}
          isEditDialogOpen={dialogOpen}
          closeEditDialog={() => setDialogOpen(false)}
        />
      )}
      <ConfirmationDialog
        open={openDialog}
        handleDialogClose={handleDialogClose}
        handleConfirmed={handleSalaryPay}
        message={`Are you sure you want to delete this Delivery Guy ?`}
        title={`Confirm  Delivery Guy deletion`}
      />
      <ConfirmationDialog
        open={openDialog3}
        handleDialogClose={handleDialogClose3}
        handleConfirmed={handleSalaryPay}
        message={`Are you ensuring that you receive the daily credit from the delivery guy before paying his salary? If not, please receive it and delete it from the daily credit, as otherwise, it will be transferred to his staff credit.`}
        title={`Confirm  Daily Salary Pay`}
      />
      <ConfirmationDialog
        open={openDialog2}
        handleDialogClose={handleDialogClose2}
        handleConfirmed={handleOpen}
        message={
          "Are you certain you wish to initiate payments for delivery personnel today? This action implies that all daily table activities have been completed, and no further entries will be added."
        }
        title={`Confirm Delivery Guy Salary Pay`}
      />
    </>
  );
};

export default UserCard;
