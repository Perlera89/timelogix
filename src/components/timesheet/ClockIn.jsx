"use client";
import React from "react";
import TimePicker from "../entry/TimePicker";
import Select from "../entry/Select";
import Textarea from "../entry/Textarea";
import Avatar from "@/components/common/Avatar";
import { Typography, Divider } from "antd";

const { Text } = Typography;

const ClockIn = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center">
        <Avatar
          letter="D"
          size="large"
          style={{ width: "64px", height: "64px" }}
        >
          <p className="text-2xl">D</p>
        </Avatar>
        <div className="flex flex-col">
          <Text>Denis Lopez</Text>
          <Text className="text-sm" type="secondary">
            Tester
          </Text>
          <Text className="text-sm" type="secondary">
            Las out 11 minutes ago
          </Text>
        </div>
      </div>
      <Divider className="m-2" />
      <TimePicker />
      <Select placeholder="Select an activity" />
      <Select placeholder="Select a project" />
      <Textarea />
    </div>
  );
};

export default ClockIn;
