"use client";
import { Button, Tag, Popconfirm, Typography, message, Spin } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

// components
import Table from "@/components/common/Table";
import Search from "@/components/entry/Search";
import RadioButton from "@/components/entry/RadioButton";
import Dropdown from "@/components/common/Dropdown";
import Card from "@/components/common/CardItem";
import Avatar from "@/components/common/Avatar";
import Modal from "@/components/Modal";
import Drawer from "@/components/common/DrawerItem";
import Result from "@/components/common/Result";

import ViewHoliday from "./admin/View";
import AdminHoliday from "./admin/Update";

// icon
import { FaTag } from "react-icons/fa";
import { BsCalendarDateFill } from "react-icons/bs";
import {
  MdRemoveRedEye,
  MdEdit,
  MdDelete,
  MdKeyboardReturn,
} from "react-icons/md";

import { HOLIDAYS_ROUTE, TYPE_HOLIDAYS_ROUTE } from "@/utils/apiRoutes";
import Employees from "@/components/timesheet/Employees";

const { Text } = Typography;

const HolidaysPage = () => {
  const holidayAction = {
    add: "add",
    edit: "edit",
  };

  // states
  const [holiday, setHoliday] = useState({});
  const [year, setYear] = useState("2023");
  const [allHolidays, setAllHolidays] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [holidaysCount, setHolidaysCount] = useState(0);
  const [holidaysUpdate, setHolidaysUpdate] = useState(false);
  const [deletedHolidays, setDeletedHolidays] = useState([]);
  const [typeHolidays, setTypeHolidays] = useState([]);
  const [typeHolidaysCount, setTypeHolidaysCount] = useState(0);
  const [openHoliday, setOpenHoliday] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTypeName, setSelectedTypeName] = useState("All");
  const [action, setAction] = useState(holidayAction.add);
  const [error, setError] = useState("");
  const [openResult, setOpenResult] = useState(false);
  const [isHolidayValidated, setIsHolidayValidated] = useState(false);
  const [clearModal, setClearModal] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  // fetch data
  // -- holiday
  const fetchholidays = async (year) => {
    console.log("holiday", holiday);
    setHolidaysUpdate(false);
    await axios
      .get(HOLIDAYS_ROUTE)
      .then((response) => {
        const holidaysData = response.data.filter(
          (holiday) =>
            holiday.is_deleted == false &&
            new Date(holiday.start_date).getFullYear() == year
        );
        console.log("holidaysData", holidaysData);
        setHolidays(holidaysData);
        setHolidaysCount(holidaysData.length);

        const deletedHolidaysData = response.data.filter(
          (holiday) => holiday.is_deleted
        );
        console.log("deletedHolidays", deletedHolidaysData);
        setDeletedHolidays(deletedHolidaysData);

        // Guardar todos los empleados sin filtrar
        setAllHolidays(holidaysData);
      })
      .catch((error) => {
        setError(error);
        eventHandlers.handleOpenResult();
      });
  };

  // -- type
  const fetchTypeHolidays = async () => {
    const typeHolidays = await axios.get(TYPE_HOLIDAYS_ROUTE);
    setTypeHolidays(typeHolidays.data);
    setTypeHolidaysCount(typeHolidays.data.length);
  };

  useEffect(() => {
    fetchholidays("2023");
    fetchTypeHolidays();
  }, [holidaysUpdate, holiday]);

  // handlers
  const eventHandlers = {
    handleOpenholiday: (holiday) => {
      console.log("holiday", holiday);
      setHoliday(holiday);
      setOpenHoliday(true);
    },
    handleCloseholiday: () => {
      setOpenHoliday(false);
    },
    handleEditholiday: (holiday) => {
      setHoliday(holiday);
      eventHandlers.handleOpenModal();
    },
    handleOpenModal: () => {
      setOpenModal(true);
    },
    handleCloseModal: () => {
      setClearModal(!clearModal);
      setOpenModal(false);
    },
    handleOpenResult: () => {
      setOpenResult(true);
    },
    handleCloseResult: () => {
      setOpenResult(false);
    },
    handleOpenResult: () => {
      setOpenResult(true);
    },
    handleCloseResult: () => {
      setOpenResult(false);
    },
    handleSearchChange: (value) => {
      setHolidays(value);
    },
    handleDateChange: ({ target: { value } }) => {
      setYear(value);
    },
    handleHolidayValidation: (isValidated) => {
      setIsHolidayValidated(isValidated);
    },
    handleYearChange: (year) => {
      console.log("year", year.target.value);
      const yearFilter = holidays.filter(
        (holiday) =>
          new Date(holiday.start_date).getFullYear() == year.target.value
      );

      setYear(year.target.value);
      setHolidays(yearFilter);
      fetchholidays(year.target.value);
    },
    handleSaveHoliday: async () => {
      try {
        if (action == holidayAction.add) {
          const response = await axios.post(HOLIDAYS_ROUTE, holiday);
          const newHoliday = response.data;
          console.log("holiday saved succesfully", newHoliday);
          setHolidaysUpdate(true);
          messages.addSuccess(holiday.name);
          eventHandlers.handleCloseModal();
        } else {
          const response = await axios.put(
            `${HOLIDAYS_ROUTE}/${holiday.id}`,
            holiday
          );
          selectedType;
          const updatedholiday = response.data;
          setHolidaysUpdate(true);
          messages.editSuccess(updatedholiday.name);
          eventHandlers.handleCloseModal();
        }
      } catch (error) {
        eventHandlers.handleOpenResult();
        setError(error);
      }
    },
    handleDeleteHoliday: async (holiday) => {
      const id = holiday.id;
      const name = holiday.name;
      await axios
        .put(`${HOLIDAYS_ROUTE}/${id}/delete`)
        .then((response) => {
          setHolidaysUpdate(true);
          messages.deletedSuccess(name);
        })
        .catch((error) => {
          eventHandlers.handleOpenResult();
          setError(error);
        });
    },
    handleRestoreHoliday: async (holiday) => {
      const id = holiday.id;
      const name = holiday.name;
      await axios
        .put(`${HOLIDAYS_ROUTE}/${id}/restore`)
        .then((response) => {
          setHolidaysUpdate(true);
          messages.restoredSuccess(name);
        })
        .catch((error) => {
          eventHandlers.handleOpenResult();
          setError(error);
        });
    },
    handleFilterChange: (value) => {
      setSelectedType(value);
      filterHolidays(value);
    },
  };

  // message
  const messages = {
    addSuccess: (name) => {
      messageApi.open({
        type: "success",
        content: `${name} saved successfully`,
        duration: 5,
      });
    },
    editSuccess: (name) => {
      messageApi.open({
        type: "success",
        content: `${name} updated successfully`,
        duration: 5,
      });
    },
    deletedSuccess: (name) => {
      messageApi.open({
        type: "success",
        content: `${name} deleted successfully`,
        duration: 5,
      });
    },
    restoredSuccess: (name) => {
      messageApi.open({
        type: "success",
        content: `${name} restored successfully`,
        duration: 5,
      });
    },
  };

  // filters
  const filters = [
    {
      label: "All",
      key: "all",
    },
    {
      type: "divider",
    },
    ...typeHolidays.map((type) => ({
      label: type.name,
      key: type.id,
    })),
    {
      label: (
        <span className="flex gap-1 items-center">
          <MdDelete />
          Deleted
        </span>
      ),
      key: "deleted",
      danger: true,
    },
  ];

  const yearOptions = [
    {
      label: "2022",
      value: "2022",
    },
    {
      label: "2023",
      value: "2023",
    },
    {
      label: "2024",
      value: "2024",
    },
  ];

  const filterHolidays = (key) => {
    if (key == "all") {
      setHolidaysUpdate(true);
      setSelectedTypeName("All");
      setHolidays(allHolidays);
    } else if (key == "deleted") {
      setHolidays(deletedHolidays);
      setSelectedTypeName("Deleted");
    } else {
      console.log("holidays", holidays);
      const filter = allHolidays.filter((holiday) => holiday.type_id == key);
      console.log("filter", filter);
      setHolidays(filter);
      const typeFilter = typeHolidays.find((type) => type.id == key);
      setSelectedTypeName(typeFilter.name);
    }
  };

  const filterProps = {
    items: filters,
    onClick: (value) => {
      eventHandlers.handleFilterChange(value.key);
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
      title: "Holiday",
      dataIndex: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      align: "center",
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      width: "10%",
      align: "center",
      sorter: (a, b) => a.joinDate - b.joinDate,
    },
    {
      title: "End date",
      dataIndex: "endDate",
      align: "center",
    },
    {
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      width: "100px",
    },
  ];

  const holidayRows = holidays?.map((holiday, key) => {
    return {
      key,
      id: holiday.id,
      name: (
        <div className="flex gap-4 items-center">
          <Avatar letter="D" size="large">
            <p className="text-lg">{holiday.name[0]}</p>
          </Avatar>
          <div className="flex flex-col">
            <Text>{holiday.name}</Text>
          </div>
        </div>
      ),
      type: (
        <Tag bordered={false} color={holiday.type.color}>
          {holiday.type.name}
        </Tag>
      ),
      startDate: dayjs(holiday.start_date).format("MMM, DD YYYY"),
      endDate: holiday.end_date
        ? dayjs(holiday.end_date).format("MMM, DD YYYY")
        : "No date",
      actions: holiday.is_deleted ? (
        <Popconfirm
          title={`Restore ${holiday.name}`}
          description="Are you sure you want to restore this holiday?"
          onConfirm={() => eventHandlers.handleRestoreholiday(holiday)}
          okType="danger"
          placement="topLeft"
          okText="Si"
          cancelText="No"
        >
          <Button
            type="text"
            icon={<MdKeyboardReturn title="Restore holiday" />}
            className="text-green-500 flex items-center justify-center"
          />
        </Popconfirm>
      ) : (
        <div className="flex justify-center">
          <Button
            type="text"
            icon={<MdRemoveRedEye title="View holiday" />}
            className="text-blue-500 flex items-center justify-center"
            onClick={() => eventHandlers.handleOpenholiday(holiday)}
            disabled={holiday.is_deleted}
          />
          <Button
            type="text"
            icon={<MdEdit title="Edit holiday" />}
            className="text-green-500 flex items-center justify-center"
            onClick={() => {
              eventHandlers.handleEditholiday(holiday);
              setAction(holidayAction.edit);
            }}
            disabled={holiday.is_deleted}
          />
          <Popconfirm
            title={`Delete ${holiday.name}`}
            description="Are you sure to delete this holiday?"
            onConfirm={() => eventHandlers.handleDeleteholiday(holiday)}
            okType="danger"
            placement="topLeft"
            okText="Si"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<MdDelete title="Delete holiday" />}
              className="text-red-500 flex items-center justify-center"
              disabled={holiday.is_deleted}
            />
          </Popconfirm>
        </div>
      ),
    };
  });

  return (
    <>
      <div className="mb-4 flex gap-4">
        <Card cardTitle="Total holidays" filterItems={null}>
          <div className="grid gap-2">
            <BsCalendarDateFill className="text-5xl text-blue-500 bg-blue-500/10 p-2.5 rounded-xl" />
            <p className="text-blue-500 text-xl ml-2">{holidaysCount}</p>
          </div>
        </Card>

        <Card cardTitle="Total type holidays" filterItems={null}>
          <div className="grid gap-2">
            <FaTag className="text-5xl text-green-500 bg-green-500/10 p-3 rounded-xl" />
            <p className="text-green-500 text-xl ml-2">{typeHolidaysCount}</p>
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button
          className="mb-4"
          onClick={() => {
            eventHandlers.handleOpenModal();
            setAction(holidayAction.add);
          }}
        >
          Add holiday
        </Button>
        <div className="mb-4 flex justify-between gap-2">
          <Search
            text="Search holiday"
            update={setHolidaysUpdate}
            options={allHolidays}
            onSearch={eventHandlers.handleSearchChange}
          />
          <RadioButton
            value={year}
            options={yearOptions}
            handleChange={eventHandlers.handleYearChange}
          />
          <Dropdown title={selectedTypeName} filters={filterProps}></Dropdown>
        </div>
      </div>
      <Table
        columns={columns}
        data={holidayRows}
        locale={{ emptyText: "No data" }}
      />
      <Drawer
        title="View holiday"
        placement="right"
        isOpen={openHoliday}
        isClose={eventHandlers.handleCloseholiday}
      >
        <ViewHoliday holiday={holiday} />
      </Drawer>
      <Modal
        title="Add holiday"
        width={500}
        isModalOpen={openModal}
        handleCancel={eventHandlers.handleCloseModal}
        handleSave={eventHandlers.handleSaveHoliday}
        validate={!isHolidayValidated}
      >
        <AdminHoliday
          action={action}
          holiday={holiday}
          setHoliday={setHoliday}
          updateValidation={eventHandlers.handleHolidayValidation}
          handleCancel={clearModal}
        />
      </Modal>
      <Result
        title={error ? error.request.statusText : null}
        subtitle={error ? error.message : null}
        error={error ? error.stack : null}
        open={openResult}
        handleClose={eventHandlers.handleCloseResult}
      />
      {contextHolder}
    </>
  );
};

export default HolidaysPage;
