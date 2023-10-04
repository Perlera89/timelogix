"use client";
import Table from "@/components/common/Table";
import Avatar from "@/components/common/Avatar";
import { Typography, Button, Popconfirm } from "antd";
import { MdEdit, MdDelete } from "react-icons/md";

const { Text } = Typography;

const Employees = () => {
  const columns = [
    {
      title: "Employee",
      dataIndex: "employee",
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "M",
      dataIndex: "monday",
      width: "100px",
    },
    {
      title: "T",
      dataIndex: "tuesday",
      width: "100px",
    },
    {
      title: "W",
      dataIndex: "wednesday",
      align: "center",
      width: "100px",
    },
    {
      title: "T",
      dataIndex: "thursday",
      align: "center",
      width: "100px",
    },
    {
      title: "F",
      dataIndex: "friday",
      align: "center",
      width: "100px",
    },
    {
      title: "S",
      dataIndex: "saturday",
      align: "center",
      width: "100px",
    },
    {
      title: "S",
      dataIndex: "sunday",
      width: "25%",
      align: "center",
      width: "100px",
    },
    {
      title: "Total",
      dataIndex: "total",
      width: "25%",
      align: "center",
      width: "100px",
    },
    {
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      width: "100px"
    },
  ];

  const data = [
    {
      key: 1,
      employee: (
        <div className="flex gap-4 items-center">
          <Avatar letter="D" size="large">
            <p className="text-lg">D</p>
          </Avatar>
          <div className="flex flex-col">
            <Text>Denis Lopez</Text>
          </div>
        </div>
      ),
      monday: "10h 0m",
      tuesday: "5h 0m",
      wednesday: "8h 0m",
      thursday: "8h 0m",
      friday: "9h 0m",
      saturday: "7h 0m",
      sunday: "10h 0m",
      total: "56h 0m",
      actions: (
        <div className="flex justify-center">
          <Button
            type="text"
            icon={<MdEdit className="text-green-500" />}
            onClick={null}
          />
          <Popconfirm
            title={`Eliminar`}
            description={`¿Estás seguro de eliminar este articulo?`}
            onConfirm={null}
            okType="danger"
            placement="topLeft"
            okText="Si"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<MdDelete className="text-red-500" />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default Employees;
