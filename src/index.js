import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ThemeProvider from "./contexts/ThemeContext";
import store from "./store/store";
import { Provider } from "react-redux";
import { SpinnerProvider } from "./contexts/SpinnerContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SpinnerProvider>
      <ThemeProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </SpinnerProvider>
  </React.StrictMode>
);
