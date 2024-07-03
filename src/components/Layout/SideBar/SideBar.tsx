"use client";
import React, { useRef, useState } from "react";
import { Button, Layout, theme } from "antd";
import UserTable from "@/components/Table/Table";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useOutsideClickClose } from "@/hooks/useOutsideClickClose";

const { Header, Sider, Content } = Layout;
const SideBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useOutsideClickClose(sidebarRef, () => setCollapsed(false));
  return (
    <Layout className="min-h-screen">
      <div
        className={`min-h-screen bg-red-300 w-[200px] fixed z-50 ${
          collapsed ? "translate-x-0" : "-translate-x-full"
        } transition block md:hidden`}
        ref={sidebarRef}
      >
        <CloseOutlined
          className="absolute right-3 top-3 w-[24px] h-[24px]"
          onClick={() => setCollapsed(false)}
        />
      </div>
      <Layout className="p-0">
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="mx-0 my-0 md:my-6 md:mx-4"
        >
          <UserTable openModal={openModal} setOpenModal={setOpenModal} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideBar;
