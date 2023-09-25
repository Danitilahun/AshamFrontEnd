import React from "react";
import {
  CardHeader,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlexBetween from "../VersatileComponents/FlexBetween";

const AsbezaCardHeader = ({
  theme,
  name,
  status,
  userType,
  asbezaData,
  handleMenuOpen,
  handleMenuClose,
  handleEdit,
  handleNew,
  handleDeleteIconClick,
  handleClick,
  humanReadableDate,
  anchorEl,
}) => {
  return (
    <CardHeader
      avatar={
        <Avatar
          sx={{ bgcolor: theme.palette.background.alt, color: "white" }}
          // src={userInfo.profileImage}
          aria-label="members image"
        >
          {asbezaData.branch === asbezaData.callcenterId ? "B" : "C"}
        </Avatar>
      }
      action={
        userType === "Branch" &&
        asbezaData.branch !== asbezaData.callcenterId ? (
          <div></div>
        ) : (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
              <MenuItem onClick={() => handleEdit(asbezaData)}>Edit</MenuItem>
              <MenuItem onClick={() => handleNew(asbezaData)}>New</MenuItem>
              <MenuItem onClick={() => handleDeleteIconClick()}>
                Delete
              </MenuItem>
            </Menu>
          </div>
        )
      }
      title={
        <FlexBetween>
          <Typography
            variant="h6"
            fontSize={18}
            sx={{ color: "text.secondary" }}
          >
            {name}
          </Typography>
          {userType === "Branch" ? (
            <Chip
              label={status}
              onClick={handleClick}
              style={{
                cursor: "pointer",
                backgroundColor:
                  status === "new order"
                    ? "red"
                    : status === "Assigned"
                    ? "yellow"
                    : "green",
                color: "black",
              }}
            />
          ) : (
            <Chip
              label={status}
              style={{
                backgroundColor:
                  status === "new order"
                    ? "red"
                    : status === "Assigned"
                    ? "yellow"
                    : "green",
                color: "black",
              }}
            />
          )}
        </FlexBetween>
      }
      subheader={humanReadableDate}
    />
  );
};

export default AsbezaCardHeader;
