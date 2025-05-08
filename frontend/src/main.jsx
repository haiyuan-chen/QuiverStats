import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/reset.css";
import "./index.css";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider
    theme={{
      token: {
        fontSizeIcon: 24, // make all icons 24px (default is 14px)
      },
    }}
  >
    <App />
  </ConfigProvider>
);
