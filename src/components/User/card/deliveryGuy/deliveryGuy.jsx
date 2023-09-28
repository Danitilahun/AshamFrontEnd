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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };
  const handleEdit = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
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
      console.error("Error during form submission:", error);
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
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
    setIsSubmitting(true);

    try {
      const res = await handlePay(branchData.active, userInfo.id, user);
      openSnackbar(res.data.message, "success");
    } catch (error) {
      console.error("Error during form submission:", error);
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
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
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
    }
    setIsSubmitting(false);
    handleMenuClose();
  };

  return (
    <>
      <LoadingSpinner isSubmitting={isSubmitting} />
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
          handleSalaryPay={handleSalaryPay}
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
        handleConfirmed={handleDeleteConfirmed}
        message={`Are you sure you want to delete this Delivery Guy ?`}
        title={`Confirm  Delivery Guy deletion`}
      />
    </>
  );
};

export default UserCard;
