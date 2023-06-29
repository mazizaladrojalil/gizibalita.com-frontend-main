import {
  DesktopOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import React, { useState } from "react";
import "./index.css";
import InputDesa from "./InputDesa";
import InputPosyandu from "./InputPosyandu";
import RegisterKaderPosyandu from "./RegisterKaderPosyandu";
import RegisterTenagaKesehatan from "./RegisterTenagaKesehatan";

export default function AdminDashboard() {
  const { Content, Footer, Sider } = Layout;

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const items = [
    getItem("Input Data", "sub1", <DesktopOutlined />, [
      getItem("Desa", "1"),
      getItem("Posyandu", "2"),
    ]),
    getItem("Register Akun", "sub2", <UserOutlined />, [
      getItem("Kader Posyandu", "3"),
      getItem("Tenaga Kesehatan", "4"),
    ]),
    getItem("Logout", "5", <LogoutOutlined />),
  ];

  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState("1");

  const handleMenu = (e) => {
    setCurrent(e.key);
    if (e.key === "5") {
      localStorage.clear();
      window.location.href = "/sign-in/admin";
    }
  };

  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo" />
          <Menu
            onClick={handleMenu}
            selectedKeys={[current]}
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout className="site-layout">
          <Content
            style={{
              margin: "0 16px",
            }}
          >
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              {current === "1" && (
                <>
                  <Breadcrumb.Item>Input Data</Breadcrumb.Item>
                  <Breadcrumb.Item>Desa</Breadcrumb.Item>
                </>
              )}
              {current === "2" && (
                <>
                  <Breadcrumb.Item>Input Data</Breadcrumb.Item>
                  <Breadcrumb.Item>Posyandu</Breadcrumb.Item>
                </>
              )}
              {current === "3" && (
                <>
                  <Breadcrumb.Item>Register Akun</Breadcrumb.Item>
                  <Breadcrumb.Item>Kader Posyandu</Breadcrumb.Item>
                </>
              )}
              {current === "4" && (
                <>
                  <Breadcrumb.Item>Register Akun</Breadcrumb.Item>
                  <Breadcrumb.Item>Tenaga Kesehatan</Breadcrumb.Item>
                </>
              )}
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              {current === "1" && <InputDesa />}
              {current === "2" && <InputPosyandu />}
              {current === "3" && <RegisterKaderPosyandu />}
              {current === "4" && <RegisterTenagaKesehatan />}
            </div>
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            GiziBalita ©2023
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}
