import React from "react";
import { Tag, Typography } from "antd";
import dayjs from "dayjs";

// components
import Avatar from "@/components/common/Avatar";

// icons
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const ViewTimeOff = ({ timeoff }) => {
  return (
    <>
      <div className="flex gap-4 items-center">
        <Avatar letter="D" size="large">
          <p className="text-lg">{timeoff.employe.name[0]}</p>
        </Avatar>
        <div className="flex flex-col">
          <Text>{timeoff.employe.name}</Text>
        </div>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Type:</Text>
        <Tag bordered={false} color={timeoff.type.color}>
          {timeoff.type.name}
        </Tag>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Start date:</Text>
        <Text type="secondary">
          {dayjs(timeoff.join_date).format("MMM, DD YYYY")}
        </Text>
      </div>
      <div className="flex gap-4 my-4">
        <Text>End date:</Text>
        <Text type="secondary">
          {timeoff.end_date
            ? dayjs(timeoff.end_date).format("MMM, DD YYYY")
            : "No date"}
        </Text>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Status:</Text>
        <Tag
          bordered={false}
          color={timeoff.status}
          icon={
            <>
              {timeoff.status == "success" && <CheckCircleOutlined />}
              {timeoff.status == "processing" && <SyncOutlined />}
              {timeoff.status == "error" && <CloseCircleOutlined />}
            </>
          }
        >
          {timeoff.status}
        </Tag>
      </div>
      <div className="flex flex-col">
        <Text>Note</Text>
        <Text type="secondary">{timeoff.note}</Text>
      </div>
    </>
  );
};

export default ViewTimeOff;
