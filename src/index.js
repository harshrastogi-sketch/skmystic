import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";   // ✅ ADD THIS
import "./index.css";
import App from "./App.js";
import { CartProvider } from "./context/CartContext.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>   {/* ✅ WRAP APP */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);