// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProLayout, { PageContainer } from "@ant-design/pro-layout";
import { DashboardOutlined, AimOutlined } from "@ant-design/icons";

import DashboardPage   from "./components/DashboardPage";
import TargetPractice  from "./components/TargetPractice";

export default function App() {
  const menuData = [
    { path: "/",       name: "Dashboard",       icon: <DashboardOutlined /> },
    { path: "/target", name: "Target Practice", icon: <AimOutlined /> },
  ];

  return (
    <BrowserRouter>
      <ProLayout
        title="QuiverStats"
        logo="/vite.svg"
        menuDataRender={() => menuData}
        menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
        fixedHeader
      >
        <PageContainer>
          <Routes>
            <Route path="/"       element={<DashboardPage />} />
            <Route path="/target" element={<TargetPractice />} />
          </Routes>
        </PageContainer>
      </ProLayout>
    </BrowserRouter>
  );
}
