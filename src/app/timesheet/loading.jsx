"use client";
import { Card, Button, Dropdown, Table, Skeleton } from "antd";

const SkeletonColumn = ({ dataIndex }) => {
  return {
    title: "",
    dataIndex,
    key: dataIndex,
    render: () => <Skeleton active />,
  };
};

const SkeletonComponent = () => {
  return (
    <>
      <div className="flex justify-between my-4">
        <Dropdown menu={<Skeleton active />}>
          <Button className="w-64"></Button>
        </Dropdown>
        <div className="flex justify-end gap-4">
          <Dropdown menu={<Skeleton active />}>
            <Button className="w-32"></Button>
          </Dropdown>
          <Dropdown menu={<Skeleton active />}>
            <Button className="w-32"></Button>
          </Dropdown>
        </div>
      </div>

      <Table
        dataSource={Array(3)
          .fill(null)
          .map((_, i) => ({ key: i }))}
        columns={[
          SkeletonColumn({ dataIndex: "column1" }),
          SkeletonColumn({ dataIndex: "column2" }),
          SkeletonColumn({ dataIndex: "column2" }),
          SkeletonColumn({ dataIndex: "column2" }),
          SkeletonColumn({ dataIndex: "column2" }),
          SkeletonColumn({ dataIndex: "column2" }),
          SkeletonColumn({ dataIndex: "column2" }),
          SkeletonColumn({ dataIndex: "column2" }),
        ]}
      />
    </>
  );
};

export default SkeletonComponent;
