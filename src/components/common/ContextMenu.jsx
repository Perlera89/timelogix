import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";

const ContextMenu = ({ day, children }) => {
  const items = [
    {
      label: "Add task",
      key: "1",
      onClick: () => alert(`Se ha agregado evento en el dia ${day}`),
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
      }}
      arrow
      placement="top"
      trigger={["contextMenu"]}
    >
      {children}
    </Dropdown>
  );
};
export default ContextMenu;
