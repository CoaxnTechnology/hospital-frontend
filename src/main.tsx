import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { HospitalProvider } from "./context/HospitalContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HospitalProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HospitalProvider>
  </React.StrictMode>
);
