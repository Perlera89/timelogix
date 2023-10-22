import React from "react";
import {
  ConfigProvider,
  Button,
  Tabs,
  Upload,
  Transfer,
  Typography,
} from "antd";

//   components
import InputText from "@/components/entry/InputText";
import Select from "@/components/entry/Select";
import Textarea from "@/components/entry/Textarea";
import TimePicker from "@/components/entry/TimePicker";

//   icons
const AdminEmployee = ({ employee }) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <InputText value={null} placeholder="Name" onChange={null} />
        <Select placeholder="Group" value={null} options={null} />
      </div>
    </>
  );
};

export default AdminEmployee;
