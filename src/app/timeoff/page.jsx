"use client";
import { Button, Tag, Popconfirm, Typography, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

// components
import Table from "@/components/common/Table";
import Search from "@/components/entry/Search";
import Dropdown from "@/components/common/Dropdown";
import Card from "@/components/common/CardItem";
import Avatar from "@/components/common/Avatar";
import Modal from "@/components/Modal";
import Drawer from "@/components/common/DrawerItem";
import Result from "@/components/common/Result";

import AdminTimeOff from "./admin/Update";
import ViewTimeOff from "./admin/View";

// icon
import { FaUsers, FaLayerGroup } from "react-icons/fa";
import {
  MdRemoveRedEye,
  MdEdit,
  MdDelete,
  MdKeyboardReturn,
} from "react-icons/md";

import { TIMEOFFS_ROUTE, GROUPS_ROUTE } from "@/utils/apiRoutes";

const { Text } = Typography;

const TimeOffsPage = () => {
  const timeoffAction = {
    add: "add",
    edit: "edit",
  };

  // states
  const [timeoff, setTimeOff] = useState({});
  const [allTimeOffs, setAllTimeOffs] = useState([]);
  const [timeoffs, setTimeOffs] = useState([]);
  const [timeoffsCount, setTimeOffsCount] = useState(0);
  const [timeoffsUpdate, setTimeOffsUpdate] = useState(false);
  const [deletedTimeOffs, setDeletedTimeOffs] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupsCount, setGroupsCount] = useState(0);
  const [openTimeOff, setOpenTimeOff] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedGroupName, setSelectedGroupName] = useState("All");
  const [action, setAction] = useState(timeoffAction.add);
  const [isTimeOffValidated, setIsTimeOffValidated] = useState(false);
  const [clearModal, setClearModal] = useState(false);
  const [error, setError] = useState("");
  const [openResult, setOpenResult] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  // fetch data
  // -- timeoff
  const fetchTimeOffs = async () => {
    console.log("timeoff", timeoff);
    setTimeOffsUpdate(false);
    await axios
      .get(TIMEOFFS_ROUTE)
      .then((response) => {
        const timeoffsData = response.data.filter(
          (timeoff) => timeoff.is_deleted == false
        );
        setTimeOffs(timeoffsData);
        setTimeOffsCount(timeoffsData.length);

        const deletedTimeOffsData = response.data.filter(
          (timeoff) => timeoff.is_deleted
        );
        console.log("deletedTimeOffs", deletedTimeOffsData);
        setDeletedTimeOffs(deletedTimeOffsData);

        setAllTimeOffs(timeoffsData);
      })
      .catch((error) => {
        eventHandlers.handleOpenResult();
        setError(error);
      });
  };

  // -- groups
  const fetchGroups = async () => {
    await axios
      .get(GROUPS_ROUTE)
      .then((response) => {
        setGroupsCount(response.data.length);
        setGroups(response.data);
      })
      .catch((error) => {
        eventHandlers.handleOpenResult();
        setError(error);
      });
  };

  useEffect(() => {
    fetchTimeOffs();
    fetchGroups();
  }, [timeoffsUpdate, timeoff]);

  // handlers
  const eventHandlers = {
    handleTimeOffChange: (data) => {
      setTimeOff(data);
    },
    handleOpenTimeOff: (timeoff) => {
      console.log("timeoff", timeoff);
      setTimeOff(timeoff);
      setOpenTimeOff(true);
    },
    handleCloseTimeOff: () => {
      setOpenTimeOff(false);
    },
    handleOpenResult: () => {
      setOpenResult(true);
    },
    handleCloseResult: () => {
      setOpenResult(false);
    },
    handleEditTimeOff: (timeoff) => {
      setTimeOff(timeoff);
      eventHandlers.handleOpenModal();
    },
    handleOpenModal: () => {
      setOpenModal(true);
    },
    handleCloseModal: () => {
      setClearModal(!clearModal);
      setOpenModal(false);
    },
    handleSearchChange: (value) => {
      setTimeOffs(value);
    },
    handleTimeOffValidation: (isValidated) => {
      setIsTimeOffValidated(isValidated);
    },
    handleSaveTimeOff: async () => {
      try {
        if (action == timeoffAction.add) {
          const response = await axios.post(TIMEOFFS_ROUTE, timeoff);
          const newTimeOff = response.data;
          console.log("TimeOff saved succesfully", newTimeOff);
          setTimeOffsUpdate(true);
          messages.addSuccess(timeoff.name);
          eventHandlers.handleCloseModal();
        } else {
          const response = await axios.put(
            `${TIMEOFFS_ROUTE}/${timeoff.id}`,
            timeoff
          );
          selectedGroup;
          const updatedTimeOff = response.data;
          setTimeOffsUpdate(true);
          messages.editSuccess(updatedTimeOff.name);
          eventHandlers.handleCloseModal();
        }
      } catch (error) {
        eventHandlers.handleOpenResult();
        setError(error);
      }
    },
    handleDeleteTimeOff: async (timeoff) => {
      try {
        const id = timeoff.id;
        await axios.put(`${TIMEOFFS_ROUTE}/${id}/delete`);
        setTimeOffsUpdate(true);
        messages.deletedSuccess();
      } catch (error) {
        <Result
          title="Deleted Failed"
          subtitle="subtitulo"
          text={error.message}
          error={error}
          status="error"
        />;
      }
    },
    handleRestoreTimeOff: async (timeoff) => {
      try {
        const id = timeoff.id;
        const name = timeoff.name;
        await axios.put(`${TIMEOFFS_ROUTE}/${id}/restore`);
        setTimeOffsUpdate(true);
        messages.restoredSuccess(name);
      } catch (error) {
        <Result
          title="Restored Failed"
          text={error.mensaje}
          error={error}
          status="error"
        />;
      }
    },
    handleFilterChange: (value) => {
      setSelectedGroup(value);
      filterTimeOffs(value);
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
    deletedSuccess: () => {
      messageApi.open({
        type: "success",
        content: "deleted successfully",
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
    ...groups.map((group) => ({
      label: group.name,
      key: group.id,
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

  const filterTimeOffs = (key) => {
    if (key == "all") {
      setTimeOffsUpdate(true);
      setSelectedGroupName("All");
      setTimeOffs(allTimeOffs);
    } else if (key == "deleted") {
      setTimeOffs(deletedTimeOffs);
      setSelectedGroupName("Deleted");
    } else {
      console.log("timeoffs", timeoffs);
      const filter = allTimeOffs.filter(
        (timeoff) => timeoff.group_id == key
      );
      console.log("filter", filter);
      setTimeOffs(filter);
      const groupFilter = groups.find((group) => group.id == key);
      setSelectedGroupName(groupFilter.name);
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
      title: "TimeOff",
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

  const timeoffRows = timeoffs?.map((timeoff, key) => {
    return {
      key,
      id: timeoff.id,
      name: (
        <div className="flex gap-4 items-center">
          <Avatar letter="D" size="large">
            <p className="text-lg">{timeoff.name[0]}</p>
          </Avatar>
          <div className="flex flex-col">
            <Text>{timeoff.name}</Text>
          </div>
        </div>
      ),
      group: (
        <Tag bordered={false} color={timeoff.group.color}>
          {timeoff.group.name}
        </Tag>
      ),
      joinDate: dayjs(timeoff.join_date).format("MMM, DD YYYY"),
      firstIn: timeoff.first_in
        ? dayjs(timeoff.first_in).format("HH:mm")
        : "No hour",
      lastOut: timeoff.last_aut
        ? dayjs(timeoff.last_aut).format("HH:mm")
        : "No hour",
      actions: timeoff.is_deleted ? (
        <Popconfirm
          title={`Restore ${timeoff.name}`}
          description="Are you sure you want to restore this timeoff?"
          onConfirm={() => eventHandlers.handleRestoreTimeOff(timeoff)}
          okType="danger"
          placement="topLeft"
          okText="Si"
          cancelText="No"
        >
          <Button
            type="text"
            icon={<MdKeyboardReturn title="Restore timeoff" />}
            className="text-green-500 flex items-center justify-center"
          />
        </Popconfirm>
      ) : (
        <div className="flex justify-center">
          <Button
            type="text"
            icon={<MdRemoveRedEye title="View timeoff" />}
            className="text-blue-500 flex items-center justify-center"
            onClick={() => eventHandlers.handleOpenTimeOff(timeoff)}
            disabled={timeoff.is_deleted}
          />
          <Button
            type="text"
            icon={<MdEdit title="Edit timeoff" />}
            className="text-green-500 flex items-center justify-center"
            onClick={() => {
              eventHandlers.handleEditTimeOff(timeoff);
              setAction(timeoffAction.edit);
            }}
            disabled={timeoff.is_deleted}
          />
          <Popconfirm
            title={`Delete ${timeoff.name}`}
            description="Are you sure to delete this timeoff?"
            onConfirm={() => eventHandlers.handleDeleteTimeOff(timeoff)}
            okType="danger"
            placement="topLeft"
            okText="Si"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<MdDelete title="Delete timeoff" />}
              className="text-red-500 flex items-center justify-center"
              disabled={timeoff.is_deleted}
            />
          </Popconfirm>
        </div>
      ),
    };
  });

  return (
    <>
      <div className="mb-4 flex gap-4">
        <Card cardTitle="Total TimeOffs" filterItems={null}>
          <div className="grid gap-2">
            <FaUsers className="text-5xl text-blue-500 bg-blue-500/10 p-2.5 rounded-xl" />
            <p className="text-blue-500 text-xl ml-2">{timeoffsCount}</p>
          </div>
        </Card>

        <Card cardTitle="Total Groups" filterItems={null}>
          <div className="grid gap-2">
            <FaLayerGroup className="text-5xl text-green-500 bg-green-500/10 p-3 rounded-xl" />
            <p className="text-green-500 text-xl ml-2">{groupsCount}</p>
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button
          className="mb-4"
          onClick={() => {
            eventHandlers.handleOpenModal();
            setAction(timeoffAction.add);
          }}
        >
          Add timeoff
        </Button>
        <div className="mb-4 flex justify-end">
          <Search
            text="Search timeoff"
            options={allTimeOffs}
            update={setTimeOffsUpdate}
            onSearch={eventHandlers.handleSearchChange}
          />
          <div className="flex justify-end">
            <Dropdown
              title={selectedGroupName}
              filters={filterProps}
            ></Dropdown>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        data={timeoffRows}
        locale={{ emptyText: "No timeoffs" }}
      />
      <Drawer
        title="View timeoff"
        placement="right"
        isOpen={openTimeOff}
        isClose={eventHandlers.handleCloseTimeOff}
      >
        <ViewTimeOff timeoff={timeoff} />
      </Drawer>
      <Modal
        title="Add TimeOff"
        width={500}
        isModalOpen={openModal}
        handleCancel={eventHandlers.handleCloseModal}
        handleSave={eventHandlers.handleSaveTimeOff}
        validate={!isTimeOffValidated}
      >
        <AdminTimeOff
          action={action}
          timeoff={timeoff}
          handleTimeOff={eventHandlers.handleTimeOffChange}
          updateValidation={eventHandlers.handleTimeOffValidation}
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

export default TimeOffsPage;
