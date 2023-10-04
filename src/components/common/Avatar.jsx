import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { Avatar } from "antd";
const url =
  "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg";
const App = ({ size, style, children }) => {
  return (
    <Avatar
      className="flex justify-center items-center"
      style={style}
      size={size}
    >
      {children}
    </Avatar>
  );
};
export default App;
