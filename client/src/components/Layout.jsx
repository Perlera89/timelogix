"use client";
import React, { useState } from "react";

// icons
import {
  RiTimeFill,
  RiPagesFill,
  RiCalendarFill,
  RiEdit2Fill,
} from "react-icons/ri";
import { HiUser } from "react-icons/hi";
import { GoFileDirectoryFill } from "react-icons/go";

// components
import { Layout, Menu, Button, Typography } from "antd";
import Image from "next/image";
import Header from "@/components/Header";

const { Text, Title } = Typography;
const { Sider, Content } = Layout;

const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
};

const items = [
  getItem(<Text>Timesheet</Text>, "home", <RiTimeFill />),
  getItem(<Text>Assistance</Text>, "assistance", <RiCalendarFill />),
  getItem(<Text>Projets</Text>, "projets", <GoFileDirectoryFill />),
  getItem(<Text>Attendance</Text>, "attendance", <RiEdit2Fill />),
  getItem(<Text>Users</Text>, "users", <HiUser />),
  getItem(<Text>Reports</Text>, "reports", <RiPagesFill />),
];

const App = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout className="h-screen flex">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="border-r-2 border-border-black"
      >
        <div className="w-full bg-jet py-4 px-2">
          <Image
            className="m-auto"
            src="/logo.svg"
            alt="dynamite"
            width={100}
            height={100}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["home"]}
          className="bg-rich-black"
          items={items}
        />
      </Sider>
      <Layout>
        <Header handleCollapsed={handleCollapsed} collapsed={collapsed} />
        <Content
          className="overflow-y-auto text-white"
          style={{
            padding: 16,
            background: "#141414",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
