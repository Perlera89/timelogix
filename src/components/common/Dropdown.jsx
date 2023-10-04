import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";

const items = [
  {
    label: "Option 1",
    key: "1",
  },
  {
    label: "Option 2",
    key: "2",
  },
];
const menuProps = {
  items,
};

const App = ({title}) => (
  <Dropdown
    className="hover:bg-white/10 text-ghost-white flex justify-center items-center px-2 rounded-lg cursor-pointer transition-colors"
    menu={menuProps}
  >
    <div className="flex gap-2 items-ned">
      <p>{title}</p>
      <DownOutlined />
    </div>
  </Dropdown>
);
export default App;