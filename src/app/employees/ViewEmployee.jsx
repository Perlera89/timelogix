import React from "react";
import { Tag, Typography } from "antd";
import dayjs from 'dayjs'

// components
import Avatar from "@/components/common/Avatar";

const { Text } = Typography;

const AddEmployee = ({ employee }) => {
  return (
    <>
      <div className="flex gap-4 items-center">
        <Avatar letter="D" size="large">
          <p className="text-lg">{employee.name[0]}</p>
        </Avatar>
        <div className="flex flex-col">
          <Text>{employee.name}</Text>
        </div>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Group:</Text>
        <Tag bordered={false}>{employee.group}</Tag>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Join Date:</Text>
        <Text type="secondary">{dayjs(employee.join_date).format("MMM, DD YYYY")}</Text>
      </div>
      <div className="flex gap-4 my-4">
        <Text>First In:</Text>
        <Text type="secondary">{dayjs(employee.first_in).format("HH:mm")}</Text>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Last Out:</Text>
        <Text type="secondary">{dayjs(employee.last_out).format("HH:mm")}</Text>
      </div>
      <div className="flex flex-col">
        <Text>Note</Text>
        <Text type="secondary">{employee.note}</Text>
      </div>
    </>
  );
};

export default AddEmployee;
