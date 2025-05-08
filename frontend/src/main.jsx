import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/reset.css";
import "./index.css";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US"; // Import the English locale

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider
    locale={enUS} // Set the locale to English
    theme={{
      token: {
        fontSizeIcon: 24, // make all icons 24px (default is 14px)
      },
    }}
  >
    <App />
  </ConfigProvider>
);
