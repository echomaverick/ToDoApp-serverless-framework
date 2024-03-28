import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "../src/components/layout/Auth"; // Import the AuthProvider

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
