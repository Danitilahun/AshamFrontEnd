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
      }}
    >
      {children}
    </Paper>
  );
};

export default CustomPaper;
