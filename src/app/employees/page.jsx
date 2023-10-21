"use client";
import axios from "axios";
import dayjs from "dayjs";

// components
import Table from "@/components/common/Table";
import Search from "@/components/entry/Search";
import Dropdown from "@/components/common/Dropdown";
import Card from "@/components/common/CardItem";
import Avatar from "@/components/common/Avatar";

import { Button, Tag, Popconfirm, Typography } from "antd";

const { Text } = Typography;

// icon
import { FaUsers, FaLayerGroup } from "react-icons/fa";
import { MdRemoveRedEye, MdEdit, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";

const locale = {
  emptyText: "No Employees",
};

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [employeesCount, setEmployeesCount] = useState(0)
  useEffect(() => {
    const handleEmployees = async () => {
      const employeesData = await axios.get(
        "http://localhost:3000/api/employees"
      );
      console.log("employeesData", employeesData.data);
      setEmployees(employeesData.data);
    };

    handleEmployees();
  }, []);
  const columns = [
    {
      title: "",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Employee",
      dataIndex: "name",
    },
    {
      title: "Group",
      dataIndex: "group",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Join date",
      dataIndex: "joinDate",
      width: "10%",
      align: "center",
      sorter: (a, b) => a.joinDate - b.joinDate,
    },
    {
      title: "First in",
      dataIndex: "firstIn",
      align: "center",
    },
    {
      title: "Last out",
      dataIndex: "lastOut",
      align: "center",
    },
    {
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      width: "100px",
    },
  ];

  const employeeRows = employees?.map((employee, key) => {
    return {
      key,
      id: 1,
      name: (
        <div className="flex gap-4 items-center">
          <Avatar letter="D" size="large">
            <p className="text-lg">{employee.name[0]}</p>
          </Avatar>
          <div className="flex flex-col">
            <Text>{employee.name}</Text>
          </div>
        </div>
      ),
      group: <Tag bordered={false}>{employee.group}</Tag>,
      joinDate: dayjs(employee.join_date).format("MMM, DD YYYY"),
      firstIn: dayjs(employee.first_in).format("HH:mm"),
      lastOut: dayjs(employee.last_aut).format("HH:mm"),
      actions: (
        <div className="flex justify-center">
          <Button
            type="text"
            icon={<MdRemoveRedEye />}
            className="text-blue-500 flex items-center justify-center"
            onClick={null}
          />
          <Button
            type="text"
            icon={<MdEdit />}
            className="text-green-500 flex items-center justify-center"
            onClick={null}
          />
          <Popconfirm
            title={`Eliminar consumidor`}
            description={`¿Estás seguro de eliminar este articulo?`}
            onConfirm={null}
            okType="danger"
            placement="topLeft"
            okText="Si"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<MdDelete />}
              className="text-red-500 flex items-center justify-center"
            />
          </Popconfirm>
        </div>
      ),
    };
  });

  return (
    <>
      <div className="mb-4 flex justify-between">
          <Search text="Buscar consumidor" />
        <div className="flex justify-end">
          <Dropdown title="Filtros" />
        </div>
      </div>

      <div className="my-4 flex gap-4">
        <Card cardTitle="Total Employees" filterItems={null}>
          <div className="grid gap-2">
            <FaUsers className="text-5xl text-blue-500 bg-blue-500/10 p-2 rounded-xl" />
            <p className="text-blue-500 text-xl ml-2">14</p>
          </div>
        </Card>

        <Card cardTitle="Total Groups" filterItems={null}>
          <div className="grid gap-2">
            <FaLayerGroup className="text-5xl text-green-500 bg-green-500/10 p-2 rounded-xl" />
            <p className="text-green-500 text-xl ml-2">14</p>
          </div>
        </Card>
      </div>

      <Button className="mb-4">Add employee</Button>
      <Table columns={columns} data={employeeRows} locale={locale} />
    </>
  );
};

export default EmployeesPage;
