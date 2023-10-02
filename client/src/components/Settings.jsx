import React from "react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, message, Space, Tooltip } from "antd";

const App = () => (
  <Dropdown.Button menu={null} placement="bottom" icon={<UserOutlined />}>
    Usuario
  </Dropdown.Button>
);
export default App;
