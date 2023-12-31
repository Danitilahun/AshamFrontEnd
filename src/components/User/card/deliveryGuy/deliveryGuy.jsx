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
import DeliveryGuyEditForm from "../../editUserForm/deliveryGuy";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSnackbar } from "../../../../contexts/InfoContext";
import deleteUser from "../../../../api/users/delete";
import UserHeader from "./header";
import CustomEllipsisTextField from "../../../CustomComponents/CustomEllipsisTextField";
import EmergencyInformation from "../../common/EmergencyInformation";
import ConfirmationDialog from "../../../VersatileComponents/ConfirmationDialog";
import { useBranch } from "../../../../contexts/BranchContext";
import handleDeliveryGuyActiveness from "../../../../api/users/handleDeliveryGuyActiveness";
import handlePay from "../../../../api/users/handleDeliveruGuyPay";
import getRequiredUserData from "../../../../utils/getBranchInfo";
import { SpinnerContext } from "../../../../contexts/SpinnerContext";
import getInternationalDate from "../../../../utils/getDate";
import CompleteTask from "../../../../api/users/CompleteTask";

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
  const { setIsSubmitting } = useContext(SpinnerContext);

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

  const handleEdit = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handlepayment = () => {
    setOpenDialog3(true);
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

  const handleComplete = async () => {
    const date = getInternationalDate();
    setIsSubmitting(true);
    const activeData = {
      deliveryguyId: userInfo.id,
      branchId: userInfo.branchId,
      active: branchData.active,
      activeDailySummery: branchData.activeDailySummery,
      activeTable: branchData.activeTable,
      date: date,
    };

    try {
      if (!userInfo.branchId) {
        throw {
          response: {
            data: {
              message:
                "Branch information is not found. Please check your connection, refresh your browser, and try again.",
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
                "Sorry, we cannot process your payment at the moment because the transaction table is unavailable.",
              type: "error",
            },
          },
        };
      }

      if (!branchData.activeDailySummery) {
        throw {
          response: {
            data: {
              message:
                "Sorry, we cannot process your payment at the moment because the transaction table is unavailable.",
              type: "error",
            },
          },
        };
      }

      if (!branchData.activeTable) {
        throw {
          response: {
            data: {
              message:
                "Sorry, we cannot process your payment at the moment because the daily table is unavailable.",
              type: "error",
            },
          },
        };
      }
      const res = await CompleteTask(user, activeData);
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
      if (!userInfo.branchId) {
        throw {
          response: {
            data: {
              message:
                "Branch information is not found. Please check your connection, refresh your browser, and try again.",
              type: "error",
            },
          },
        };
      }

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
      {/* <p style={{ color: "blue" }}>Screen Width: {screenWidth}px</p>
      <p style={{ color: "red" }}>Screen Height: {screenHeight}px</p> */}
      <Card
        sx={{
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
          color: theme.palette.secondary[700],
          marginTop: "1rem",
          width: "100%",
          // height: `${100 - parseInt((parseInt(screenWidth) * 100) / 1536)}%`,
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
          handleComplete={handleComplete}
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
      <ConfirmationDialog
        open={openDialog3}
        handleDialogClose={handleDialogClose3}
        handleConfirmed={handleSalaryPay}
        message={`Are you ensuring that you receive the daily credit from the delivery guy before paying his salary? If not, please receive it and delete it from the daily credit, as otherwise, it will be transferred to his staff credit.`}
        title={`Confirm  Daily Salary Pay`}
      />
    </>
  );
};

export default UserCard;
