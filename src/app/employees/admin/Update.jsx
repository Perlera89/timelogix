import React, { useState, useEffect } from "react";
import axios from "axios";
import { GROUPS_ROUTE } from "@/utils/apiRoutes";

//   components
import InputText from "@/components/entry/InputText";
import SelectGroup from "@/components/entry/SelectCustom";
import Textarea from "@/components/entry/Textarea";
import Badge from "@/components/common/Badge";
import Result from "@/components/common/Result";

const AdminEmployee = ({
  action,
  employee,
  handleEmployee,
  updateValidation,
  handleCancel,
}) => {
  // states
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(null);
  const [groupsUpdate, setGroupsUpdate] = useState(false);
  const [groupName, setGroupName] = useState(null);
  const [name, setName] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");
  const [openResult, setOpenResult] = useState(false);

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

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
    handleEmployee((prevData) => ({
      ...prevData,
      note: event.target.value,
    }));
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.toHexString());
  };

  const handleAddGroup = async (name) => {
    const group = {
      name,
      color: selectedColor,
    };
    await axios
      .post(GROUPS_ROUTE, group)
      .then((res) => {
        console.log(res);
        setGroupsUpdate(true);
        setGroupName(null);
      })
      .catch((error) => {
        handleOpenResult();
        setError(error);
      });
  };

  const handleOpenResult = () => {
    setOpenResult(true);
  };

  const handleCloseResult = () => {
    setOpenResult(false);
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
  }, [handleCancel]);

  useEffect(() => {
    setGroupsUpdate(false);
    if (action == "edit") {
      setName(employee.name);
      setGroup(employee.group.id);
      setNote(employee.note);
    }

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
  }, [action, employee, groupsUpdate]);
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
          <SelectGroup
            placeholder="Select group"
            placeholderInput="Enter group"
            items={groups}
            value={group}
            handleSelect={handleGroupSelect}
            inputValue={groupName}
            handleInputChange={handleGroupNameChange}
            handleAdd={handleAddGroup}
            seletedColor={selectedColor}
            handleColorChange={handleColorChange}
          />
        </Badge>
        <Textarea
          placeholder="Note"
          value={note}
          handleChange={handleNoteChange}
        />
      </div>
      <Result
        title={error ? error.request.statusText : null}
        subtitle={error ? error.message : null}
        error={error ? error.stack : null}
        open={openResult}
        handleClose={handleCloseResult}
      />
    </>
  );
};

export default AdminEmployee;
