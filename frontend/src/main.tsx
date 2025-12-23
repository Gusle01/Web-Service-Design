import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ 전역 CSS는 여기서 한 번만
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
