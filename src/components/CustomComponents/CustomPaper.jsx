import { Paper, useTheme } from "@mui/material";

const CustomPaper = ({ children, marginTop = 0, marginBottom = 10 }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={3}
      style={{
        padding: 16,
        marginTop: marginTop,
        marginBottom: marginBottom,
        textAlign: "center",
        backgroundColor: theme.palette.background.alt,
        color: theme.palette.secondary[100],
        boxShadow:
          "0px 3px 3px -2px rgba(0,0,0,0), 0px 3px 4px 0px rgba(0,0,0,0.12), 0px 1px 8px 0px rgba(0,0,0,0.12)",
      }}
    >
      {children}
    </Paper>
  );
};

export default CustomPaper;
