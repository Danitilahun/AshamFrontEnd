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
import { useAuth } from "../../contexts/AuthContext";
import CustomEllipsisTextField from "../CustomComponents/CustomEllipsisTextField";
import EditUserDialog from "./EditUserDialog";
import editUser from "../../api/services/Users/editUser";
import { useSnackbar } from "../../contexts/InfoContext";
import { useBranch } from "../../contexts/BranchContext";
import { useNavigate } from "react-router-dom";
import setActiveness from "../../api/services/DeliveryGuy/setActiveness";
import { useEffect } from "react";
import getDocumentById from "../../api/utils/try";
import ConfirmationDialog from "../VersatileComponents/ConfirmationDialog";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import EmergencyInformation from "./EmergencyInformation";
import UserHeader from "./UserHeader";
import { useDispatch, useSelector } from "react-redux";
import handlePay from "../../api/services/DeliveryGuy/pay";
import AdminEditForm from "./editUserForm/admin";
import deleteUser from "../../api/users/delete";
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

const updateFields = (targetObject, sourceObject) => {
  // Loop through the keys in the source object
  for (const key in sourceObject) {
    // Check if the key exists in both objects
    console.log("key", key);
    console.log(key in targetObject);
    if (key in targetObject) {
      // Update the value in the target object
      targetObject[key] = sourceObject[key];
    }
  }
};

const UserCard = ({ userInfo, userType }) => {
  console.log("user info", userInfo);
  const theme = useTheme();
  const { user, forgotPassword } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedItemId, selectedItem } = useSelector(
    (state) => state.itemDetails
  );
  console.log("selectedItem----------del", selectedItem);
  console.log("selectedItemId---------del", selectedItemId);
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    changeBranch,
    changeBranchName,
    changecallCenterId,
    changecallCenterName,
  } = useBranch();
  const [documentData2, setDocumentData2] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const [editFormValues, setEditFormValues] = useState({
    fullName: "",
    phone: "",
    branch: "",
    email: "",
    bankAccount: "",
    fullAddress: "",
    securityName: "",
    securityAddress: "",
    securityPhone: "",
  });

  const handleEdit = () => {
    setEditFormValues({
      fullName: userInfo.fullName,
      email: userInfo.email,
      phone: userInfo.phone,
      branch: userInfo.branch,
      bankAccount: userInfo.bankAccount,
      fullAddress: userInfo.fullAddress,
      securityName: userInfo.securityName,
      securityAddress: userInfo.securityAddress,
      securityPhone: userInfo.securityPhone,
    });
    setDialogOpen(true);
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

  // const [active, setActive] = useState(userInfo.activeness);
  // console.log("active", active);
  const handleClick = async () => {
    // setActive((prevState) => !prevState);
    setIsSubmitting(true);
    const activeData = {
      deliveryManId: userInfo.id,
      deliveryGuyName: userInfo.fullName,
      branchId: userInfo.branch,
      active: !userInfo.activeness,
    };
    console.log(activeData);

    try {
      await setActiveness(activeData, user);
      openSnackbar(
        `${userInfo.fullName} activeness edited successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error during form submission:", error);
      openSnackbar(
        `Error occurred while performing editing ${userType}.`,
        "error"
      );
    }
    setIsSubmitting(false);
  };

  const handleSalaryPay = async () => {
    // setActive((prevState) => !prevState);
    if (!selectedItem.active) {
      openSnackbar(
        `Sorry , you can't pay , since there is no salary table.`,
        "info"
      );
      return;
    }
    setIsSubmitting(true);

    try {
      await handlePay(selectedItem.active, userInfo.id, user);
      openSnackbar(`${userInfo.fullName} paid successfully!`, "success");
    } catch (error) {
      console.error("Error during form submission:", error);
      openSnackbar(`Error occurred while try to pay ${userType}.`, "error");
    }
    setIsSubmitting(false);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    console.log("the id is ", editFormValues);

    setIsSubmitting(true);
    try {
      let newEmail = "";
      if (userInfo.email !== editFormValues.email) {
        newEmail = editFormValues.email;
      }
      updateFields(userInfo, editFormValues);
      await editUser(userType, user, userInfo.id, userInfo);
      openSnackbar(`${userType} edited successfully!`, "success");
      if (newEmail !== "") {
        forgotPassword(newEmail);
      }
      setIsSubmitting(false);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error during form submission:", error);
      openSnackbar(
        `Error occurred while performing editing ${userType}.`,
        "error"
      );
    }
    setIsSubmitting(false);
    // Close the dialog
    // setDialogOpen(false);
  };
  // const handleDeleteConfirmed = async () => {
  //   handleDialogClose();
  //   setIsSubmitting(true);
  //   try {
  //     if (userType === "deliveryguy" || userType === "admin") {
  //       await deleteUser(userType, user, userInfo.id, userInfo.branch);
  //     } else {
  //       await deleteUser(userType, user, userInfo.id);
  //     }
  //     openSnackbar(`${userType} deleted successfully!`, "success");

  //     if (userType === "deliveryguy") {
  //       const activeData = {
  //         deliveryManId: userInfo.id,
  //         deliveryGuyName: userInfo.fullName,
  //         branchId: userInfo.branch,
  //         active: false,
  //         activeness: userInfo.activeness,
  //       };
  //       await setActiveness(activeData, user);
  //       const storedData = JSON.parse(localStorage.getItem("userData"));
  //       storedData.numberofworker = parseInt(storedData.numberofworker) - 1;
  //       localStorage.setItem("userData", JSON.stringify(storedData));
  //     }
  //   } catch (error) {
  //     openSnackbar(
  //       `Error occurred while performing deleting ${userType}.`,
  //       "error"
  //     );
  //   }
  //   setIsSubmitting(false);
  //   handleMenuClose();
  // };

  const handleDeleteConfirmed = async () => {
    handleDialogClose();
    setIsSubmitting(true);
    try {
      const res = await deleteUser(user, userInfo.id, "admin");
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
          userType={userType}
          handleCardClick={handleCardClick}
          handleClick={handleClick}
          handleSalaryPay={handleSalaryPay}
        />

        <CardContent>
          <CustomEllipsisTextField label="Phone" value={userInfo.phone} />
          {userType === "staff" && (
            <CustomEllipsisTextField label="Role" value={userInfo.role} />
          )}
          {userType === "deliveryguy" || userType === "staff" ? (
            <div></div>
          ) : (
            <CustomEllipsisTextField label="Email" value={userInfo.email} />
          )}
          <CustomEllipsisTextField
            label="BankAccount"
            value={userInfo.bankAccount}
          />
          <CustomEllipsisTextField
            label="FullAddress"
            value={userInfo.fullAddress}
          />
          {userType === "admin" ? (
            <CustomEllipsisTextField
              label="Branch"
              value={userInfo.branchName}
            />
          ) : (
            <div></div>
          )}
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
      {/* <EditUserDialog
        usertype={userType}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        handleEditSubmit={handleEditSubmit}
        editFormValues={editFormValues}
        setEditFormValues={setEditFormValues}
      /> */}
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
        message={`Are you sure you want to delete this ${userType} ?`}
        title={`Confirm  ${userType} deletion`}
      />
    </>
  );
};

export default UserCard;
