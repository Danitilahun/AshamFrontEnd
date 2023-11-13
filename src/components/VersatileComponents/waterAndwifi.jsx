import React from "react";
import { Tabs, Tab, Paper, useTheme } from "@mui/material";

const WWTableTab = ({
  tableDate,
  selectedTab,
  handleTabChange,
  from = null,
}) => {
  const theme = useTheme();

  return (
    <Paper
      square
      style={{
        marginTop: "10px",
        backgroundColor: theme.palette.background.alt,
        width: from ? "100%" : "76vw",
        overflowX: "auto",
      }}
    >
      <Tabs
        value={selectedTab !== null ? selectedTab : false} // Set to false initially
        onChange={handleTabChange}
        style={{
          color: theme.palette.secondary[700],
          backgroundColor: theme.palette.background.alt,
        }}
        scrollable
        scrollButtons="auto"
        indicatorColor="primary"
      >
        {tableDate.length &&
          [0, 1, 2, 3].map((entry, index) => (
            <Tab
              key={index}
              label={`${entry} days Remain`}
              style={{
                color: theme.palette.secondary[300],
                ...(selectedTab === index && {
                  color: theme.palette.secondary[100],
                  borderBottom: `5px solid ${theme.palette.grey[900]}`,
                }),
              }}
            />
          ))}
      </Tabs>
    </Paper>
  );
};

export default WWTableTab;
