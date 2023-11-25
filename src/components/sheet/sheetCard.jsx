import * as React from "react";
import { useContext } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { green } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "../../contexts/InfoContext";
import { useAuth } from "../../contexts/AuthContext";
import { SpinnerContext } from "../../contexts/SpinnerContext";
import getHumanReadableDate from "../../utils/humanReadableDate";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useBranch } from "../../contexts/BranchContext";
import ConfirmationDialog from "../VersatileComponents/ConfirmationDialog";
import deleteSheet from "../../api/sheet/delete";
import useUserClaims from "../../hooks/useUserClaims";
import FlexBetween from "../VersatileComponents/FlexBetween";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const SheetCard = ({ sheetInfo }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const { setIsSubmitting } = useContext(SpinnerContext);
  const { changesheetName, changetableDate } = useBranch();
  const [openDialog, setOpenDialog] = React.useState(false);
  const userClaims = useUserClaims(user);
  const handleDeleteIconClick = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const theme = useTheme();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    handleDialogClose();
    try {
      if (!sheetInfo.id) {
        throw {
          response: {
            data: {
              message: "sheet is not found.",
              type: "error",
            },
          },
        };
      }
      await deleteSheet(user, sheetInfo.id);
      openSnackbar(`Sheet deleted successfully!`, "success");
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

  const humanReadableDate = getHumanReadableDate(sheetInfo.realDate);

  const handleCardClick = (event) => {
    event.preventDefault();
    changesheetName(sheetInfo.name);
    changetableDate(sheetInfo.tableDate);
    navigate(`/table/${params.id}/${sheetInfo.id}`);
  };

  const { screenWidth } = useWindowDimensions();

  const fontSize = screenWidth >= 1536 ? 18 : (screenWidth / 1536) * 18 + "px";
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
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: green[300] }} aria-label="recipe">
              {sheetInfo.sheetNumber}
            </Avatar>
          }
          action={
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {userClaims.superAdmin ? (
                <>
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
                    <MenuItem onClick={() => handleDeleteIconClick()}>
                      Delete
                    </MenuItem>
                  </Menu>
                </>
              ) : null}
            </div>
          }
          title={
            <FlexBetween>
              <Tooltip title={sheetInfo.name}>
                <Typography
                  variant="h6"
                  fontSize={fontSize}
                  sx={{
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: screenWidth < 1300 ? "50px" : "50%",
                  }}
                >
                  {sheetInfo.name}
                </Typography>
              </Tooltip>

              {/* <Gri container>
                <Grid item></Grid>
                <Grid item></Grid>
              </Grid> */}
              {!userClaims.superAdmin ? (
                <Chip
                  label={sheetInfo.sheetStatus}
                  style={{
                    marginLeft: "3px",
                    backgroundColor:
                      sheetInfo.sheetStatus === "Completed" ? "green" : "red",
                    color: "white",
                  }}
                />
              ) : null}

              {/* <ExportToExcel file={sheetInfo.name} branchId={params.id} /> */}
            </FlexBetween>
          }
          subheader={humanReadableDate}
        />

        <div onClick={handleCardClick}>
          <CardMedia
            component="img"
            height="100%"
            image="/assets/sheet.png"
            alt="Sheet"
            style={{ cursor: "pointer" }}
          />
        </div>

        <ConfirmationDialog
          open={openDialog}
          handleDialogClose={handleDialogClose}
          handleConfirmed={handleDelete}
          message={` Are you sure you want to delete this sheet?`}
          title={`Confirm Sheet Deletion`}
        />
      </Card>
    </>
  );
};

export default SheetCard;
