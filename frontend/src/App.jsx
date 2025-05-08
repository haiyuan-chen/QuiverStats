import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProLayout, { PageContainer } from "@ant-design/pro-layout";
import { Layout } from "antd";
import { DashboardOutlined, AimOutlined } from "@ant-design/icons";
import DashboardPage from "./components/DashboardPage";
import TargetPractice from "./components/VirtualTargetPage";
import QuiverPage from "./components/QuiverPage"; // Import the actual QuiverPage
import { ActiveArrowProvider } from "./contexts/ActiveArrowContext"; // Import the provider
import { GiArcheryTarget } from "react-icons/gi";
import { GiQuiver } from "react-icons/gi";
import { GiArcher } from "react-icons/gi";

const { Header, Content, Footer } = Layout;

export default function App() {
  const menuData = [
    { path: "/", name: "Overview", icon: <GiArcher /> },
    { path: "/target", name: "Virtual Target", icon: <GiArcheryTarget /> },
    { path: "/quivers", name: "My Quivers", icon: <GiQuiver /> },
  ];

  return (
    <ActiveArrowProvider>
      {" "}
      {/* Wrap with ActiveArrowProvider */}
      <BrowserRouter>
        <Layout style={{ height: "100vh" }}>
          <Header style={{ padding: 0 }}>
            {/* you can put your logo/nav here, or leave blank if ProLayout handles it */}
          </Header>

          <Content style={{ padding: 0, height: "calc(100% - 64px)" }}>
            {/* ProLayout gives you sidebar + header; we still wrap in it */}
            <ProLayout
              style={{ height: "100%" }}
              contentWidth="Fluid"
              fixedHeader={false}
              title="QuiverStats"
              logo={false}
              menuDataRender={() => menuData}
              menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
            >
              <PageContainer
                style={{ height: "100%", padding: 0 }}
                contentStyle={{ height: "100%" }}
              >
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/target" element={<TargetPractice />} />
                  <Route path="/quivers" element={<QuiverPage />} />{" "}
                  {/* Use actual component */}
                  {/* Add more routes here as needed */}
                  <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
              </PageContainer>
            </ProLayout>
          </Content>

          <Footer style={{ textAlign: "center" }}>
            {/* optional footer; height here counts against calc above */}
          </Footer>
        </Layout>
      </BrowserRouter>
    </ActiveArrowProvider>
  );
}
