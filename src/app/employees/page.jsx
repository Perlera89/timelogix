"use client";
import axios from "axios";
import dayjs from "dayjs";

// components
import Table from "@/components/common/Table";
import Search from "@/components/entry/Search";
import Dropdown from "@/components/common/Dropdown";
import Card from "@/components/common/CardItem";
import Avatar from "@/components/common/Avatar";
import Modal from "@/components/Modal";
import Drawer from "@/components/common/DrawerItem";

import { Button, Tag, Popconfirm, Typography, Menu } from "antd";

const { Text } = Typography;

// icon
import { FaUsers, FaLayerGroup } from "react-icons/fa";
import { MdRemoveRedEye, MdEdit, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import ViewEmployee from "./ViewEmployee";
import AdminEmployee from "./AdminEmployee";

const locale = {
  emptyText: "No Employees",
};

const EmployeesPage = () => {
  const employeeAction = {
    add: "ADD",
    edit: "EDIT",
  };

  // states
  const [employee, setEmployee] = useState({});
  const [employees, setEmployees] = useState([]);
  const [groups, setGroups] = useState([]);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [openEmployee, setOpenEmployee] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedGroupName, setSelectedGroupName] = useState("All");
  const [action, setAction] = useState(employeeAction.add);

  // handlers
  const handleOpenEmployee = (employee) => {
    setEmployee(employee);
    setOpenEmployee(true);
  };

  const handleCloseEmployee = () => {
    setOpenEmployee(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = await axios.get("http://localhost:3000/api/employees");
      const employeesData = employees.data;
      console.log("data", employeesData);

      const groups = await axios.get("http://localhost:3000/api/groups");
      const groupsData = groups.data;
      setGroups(groupsData);

      if (selectedGroup === "all") {
        setEmployees(employeesData);
      } else {
        setEmployees(
          employeesData.filter((employee) => employee.group.id == selectedGroup)
        );
      }
    };

    fetchEmployees();
  }, [selectedGroup]);

  // filters
  const filters = [
    {
      label: "All",
      key: "all",
    },
    ...groups.map((group) => ({
      label: group.name,
      key: group.id,
    })),
  ];

  const filterProps = {
    items: filters,
    onClick: (value) => {
      console.log("value.key", value.key);
      console.log('groups', groups)
      const groupFilter = groups.find((group) => group.id == value.key);
      console.log('groupFilter', groupFilter)

      const seletedName = groupFilter ? groupFilter.name : "All";
      console.log("seletedName", seletedName);
      setSelectedGroupName(seletedName);
      setSelectedGroup(value.key);
    },
  };

  const columns = [
    {
      title: "",
      dataIndex: "id",
      width: "50px",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Employee",
      dataIndex: "name",
    },
    {
      title: "Group",
      dataIndex: "group",
      align: "center",
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

  const employeeRows = employees
    .filter((employee) =>
      employee.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    ?.map((employee, key) => {
      return {
        key,
        id: employee.id,
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
        group: <Tag bordered={false}>{employee.group.name}</Tag>,
        joinDate: dayjs(employee.join_date).format("MMM, DD YYYY"),
        firstIn: dayjs(employee.first_in).format("HH:mm"),
        lastOut: dayjs(employee.last_aut).format("HH:mm"),
        actions: (
          <div className="flex justify-center">
            <Button
              type="text"
              icon={<MdRemoveRedEye />}
              className="text-blue-500 flex items-center justify-center"
              onClick={() => handleOpenEmployee(employee)}
            />
            <Button
              type="text"
              icon={<MdEdit />}
              className="text-green-500 flex items-center justify-center"
              onClick={null}
            />
            <Popconfirm
              title={`Eliminar ${employee.name}`}
              description={`¿Estás seguro de eliminar este empleado?`}
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
      <div className="mb-4 flex gap-4">
        <Card cardTitle="Total Employees" filterItems={null}>
          <div className="grid gap-2">
            <FaUsers className="text-5xl text-blue-500 bg-blue-500/10 p-2 rounded-xl" />
            <p className="text-blue-500 text-xl ml-2">{employeesCount}</p>
          </div>
        </Card>

        <Card cardTitle="Total Groups" filterItems={null}>
          <div className="grid gap-2">
            <FaLayerGroup className="text-5xl text-green-500 bg-green-500/10 p-2 rounded-xl" />
            <p className="text-green-500 text-xl ml-2">14</p>
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button className="mb-4" onClick={handleOpenModal}>Add employee</Button>
        <div className="mb-4 flex justify-end">
          <Search text="Buscar consumidor" onSearch={handleSearchChange} />
          <div className="flex justify-end">
            <Dropdown
              title={selectedGroupName}
              filters={filterProps}
            ></Dropdown>
          </div>
        </div>
      </div>
      <Table columns={columns} data={employeeRows} locale={locale} />
      <Drawer
        title="View employee"
        placement="right"
        isOpen={openEmployee}
        isClose={handleCloseEmployee}
      >
        <ViewEmployee employee={employee} />
      </Drawer>
      <Modal
        title="Add Employee"
        width={600}
        isModalOpen={openModal}
        handleCancel={handleCloseModal}
        handleSave={null}
      >
        <AdminEmployee />
      </Modal>
    </>
  );
};

export default EmployeesPage;
