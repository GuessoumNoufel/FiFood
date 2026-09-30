// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollTop.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <App />
        <Toaster
          position="top-center"
          reverseOrder={false} // stacking order when multiple toasts show at once
          gutter={7} // spacing between stacked toasts
          toastOptions={{
            duration: 2000, // ms before auto-dismiss
            style: {
              background: "#FBF7F1",
              color: "#2B2620",
              border: "1px solid #E8E0D4",
              borderRadius: "10px",
              padding: "12px 16px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
            },
            success: {
              duration: 2000,
              iconTheme: {
                primary: "#82c91e",
                secondary: "#fff",
              },
              style: {
                background: "#FBF7F1",
                border: "1px solid #E8CDBB",
              },
            },
            error: {
              iconTheme: {
                primary: "#f03e3e",
                secondary: "#fff",
              },
              style: {
                background: "#FDF1EE",
                border: "1px solid #F0C4BC",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
