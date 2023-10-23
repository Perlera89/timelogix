"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Tabs } from "antd";
import { GROUPS_ROUTE } from "@/utils/apisRoute";

import { MdInfo } from "react-icons/md";

//   components
import InputText from "@/components/entry/InputText";
import Select from "@/components/entry/Select";
import Textarea from "@/components/entry/Textarea";
import TimePicker from "@/components/entry/TimePicker";
import Badge from "@/components/common/Badge";

const AdminEmployee = ({
  employee,
  handleEmployee,
  updateValidation,
}) => {
  // states
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(null);
  const [name, setName] = useState(null);
  const [note, setNote] = useState(null);

  // handlers
  const handleNameChange = (event) => {
    setName(event.target.value);
    handleEmployee((prevData) => ({
      ...prevData,
      name: event.target.value,
    }));
  };

  const handleGroupSelect = (value) => {
    setGroup(value);
    handleEmployee((prevData) => ({
      ...prevData,
      group_id: value,
    }));
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
    handleEmployee((prevData) => ({
      ...prevData,
      note: event.target.value,
    }));
  };

  // validations
  const validations = {
    name: (value) => !!value && value.length >= 3,
    group: (value) => !!value,
  };

  const [validation, setValidation] = useState({
    name: false,
    group: false,
  });

  // Actualizar el estado de validación
  useEffect(() => {
    setValidation({
      name: validations.name(name),
      group: validations.group(group),
    });
  }, [name, group]);

  // Verificar los campos
  useEffect(() => {
    const areAllFieldsValid = Object.values(validation).every(Boolean);
    updateValidation(areAllFieldsValid);
  }, [validation]);

  const resetForm = () => {
    setName(null);
    setGroup(null);
  };

  useEffect(() => {
    resetForm();
    const fetchGroups = async () => {
      const groups = await axios.get(GROUPS_ROUTE);
      const groupsData = groups.data;
      setGroups(
        groupsData.map((group) => ({
          value: group.id,
          label: group.name,
        }))
      );
    };

    fetchGroups();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-2 mt-4">
        <Badge
          title="Name is required: minimum 3 chareacteres"
          validate={validation.name}
        >
          <InputText
            placeholder="Name"
            value={name}
            handleChange={handleNameChange}
          />
        </Badge>

        <Badge title="Select group is required" validate={validation.group}>
          <Select
            value={group}
            placeholder="Select group"
            options={groups}
            handleSelect={handleGroupSelect}
          />
        </Badge>

        <Textarea
          placeholder="Note"
          value={note}
          handleChange={handleNoteChange}
        />
      </div>
    </>
  );
};

export default AdminEmployee;
