import React, { useMemo } from "react";
import AuthContextProvider from "./contexts/AuthContext";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { themeSettings } from "./utils/theme";
import { useCustomTheme } from "./contexts/ThemeContext";
import Layout from "./layouts/layout";
import { SnackbarProvider } from "./contexts/InfoContext";
import BranchLayout from "./layouts/BranchLayout";
import BranchProvider from "./contexts/BranchContext";
import TableLayout from "./layouts/TableLayout";
import ServiceLayout from "./layouts/ServiceLayout";
import FinanceLayout from "./layouts/FinanceLayout";
import Notification from "./services/notification";
import DashboardRoutes from "./routes/DashboardRoutes";
import BranchRoutes from "./routes/branchRoutesData";
import mainPagesRoutesData from "./routes/mainPagesRoutesData";
import ServiceRoutes from "./routes/serviceRoutesData";
import TableRoutes from "./routes/tableRoutesData";
import FinanceRoutes from "./routes/financeRoutesData";
import AuthRoutes from "./routes/authRoutesData";
import mainFinanceRoutesData from "./routes/financeMainRoute";
import FinanceMainLayout from "./layouts/financeMainLayout";
import NotFoundPage from "./pages/InfoPage/NotFoundPage";
import OfflinePage from "./pages/InfoPage/OfflinePage";

const App = () => {
  const { mode } = useCustomTheme();
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app-container">
      <BrowserRouter>
        <AuthContextProvider>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>
              <BranchProvider>
                <CssBaseline />
                <Routes>
                  <Route element={<Layout />}>
                    {DashboardRoutes()}
                    {mainPagesRoutesData()}
                  </Route>

                  <Route element={<BranchLayout />}>{BranchRoutes()}</Route>
                  <Route element={<ServiceLayout />}>{ServiceRoutes()}</Route>

                  <Route element={<TableLayout />}>{TableRoutes()}</Route>
                  <Route element={<FinanceMainLayout />}>
                    {mainFinanceRoutesData()}
                  </Route>

                  <Route element={<FinanceLayout />}>{FinanceRoutes()}</Route>
                  {AuthRoutes()}

                  <Route path="/offline" element={<OfflinePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BranchProvider>
            </SnackbarProvider>
          </ThemeProvider>
          <Notification />
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
