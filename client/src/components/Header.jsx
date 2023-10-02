"use client";
// components
import React, { useState } from "react";
import { Layout, Button, Typography } from "antd";
import Settings from "@/components/Settings";

// icons
// icons
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const { Header } = Layout;
const { Text, Title } = Typography;

const HeaderPage = ({ handleCollapsed, collapsed }) => {
  return (
    <Header
      className="border-b-2 border-border-black"
      style={{
        padding: 0,
        background: "#191919",
      }}
    >
      <div className="flex justify-between items-center gap-2">
        <div className="flex justify-start">
          <Button
            type="text"
            icon={
              collapsed ? (
                <RiArrowRightSLine className="text-2xl" title="Show menu" />
              ) : (
                <RiArrowLeftSLine className="text-2xl" title="Hide menu" />
              )
            }
            onClick={handleCollapsed}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Title className="flex items-center" level={4}>Timesheet</Title>
        </div>
        <div className="flex justify-end mr-4">
          <Settings />
        </div>
      </div>
    </Header>
  );
};

export default HeaderPage;
