import React, { useState, useEffect } from "react";
import axios from "axios";
import { TYPE_HOLIDAYS_ROUTE } from "@/utils/apiRoutes";
import { message, DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

//   components
import InputText from "@/components/entry/InputText";
// import DatePicker from "@/components/entry/DatePicker";
import SelectType from "@/components/entry/SelectCustom";
import Badge from "@/components/common/Badge";
import Result from "@/components/common/Result";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";
const currentDate = dayjs();

const { RangePicker } = DatePicker;

const AdminHoliday = ({
  action,
  holiday,
  setHoliday,
  updateValidation,
  handleCancel,
}) => {
  // states
  const [types, setTypes] = useState([]);
  const [typesUpdate, setTypesUpdate] = useState(false);
  const [typeName, setTypeName] = useState(null);
  const [name, setName] = useState(null);
  const [type, setType] = useState(null);
  const [dates, setDates] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#606060");
  const [error, setError] = useState("");
  const [openResult, setOpenResult] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // handlers
  const eventHandlers = {
    handleNameChange: (event) => {
      setName(event.target.value);

      setHoliday((prevData) => ({
        ...prevData,
        name: event.target.value,
      }));
    },
    handleTypeSelect: (value) => {
      setType(value);
      setHoliday((prevData) => ({
        ...prevData,
        type_id: value,
      }));
    },
    handleTypeNameChange: (event) => {
      setTypeName(event.target.value);
    },
    handleDatesChange: (value) => {
      const selectedDates = value || [];
      const startDate = selectedDates[0];
      const endDate = selectedDates[1];

      if (startDate && endDate) {
        if (startDate.isBefore(currentDate, "day")) {
          setDatesError(true);
          return;
        }
      }

      setDates(selectedDates);
      setHoliday((prevData) => ({
        ...prevData,
        start_date: startDate.format("YYYY-MM-DDTHH:mm:ssZ"),
        end_date: endDate.format("YYYY-MM-DDTHH:mm:ssZ"),
      }));
    },

    handleColorChange: (color) => {
      setSelectedColor(color.toHexString());
    },
    handleAddType: async (name) => {
      const existingTypes = types.map((type) => type.label);

      if (existingTypes.includes(name)) {
        isExistsMessage(name);
      } else {
        const type = {
          name,
          color: selectedColor,
        };
        await axios
          .post(TYPE_HOLIDAYS_ROUTE, type)
          .then((res) => {
            console.log(res);
            setTypesUpdate(true);
            setTypeName(null);
          })
          .catch((error) => {
            handleOpenResult();
            setError(error);
          });
      }
    },
    handleOpenResult: () => {
      setOpenResult(true);
    },
    handleCloseResult: () => {
      setOpenResult(false);
    },
  };

  const isExistsMessage = (name) => {
    messageApi.open({
      type: "warning",
      content: `${name} already exists`,
      duration: 5,
    });
  };

  // validations
  const validations = {
    name: (value) => !!value && value.length >= 3,
    type: (value) => !!value,
    dates: (value) => !!value,
  };

  const [validation, setValidation] = useState({
    name: false,
    type: false,
    dates: false,
  });

  // Actualizar el estado de validación
  useEffect(() => {
    setValidation({
      name: validations.name(name),
      type: validations.type(type),
      dates: validations.dates(dates),
    });
  }, [name, dates, type]);

  // Verificar los campos
  useEffect(() => {
    const areAllFieldsValid = Object.values(validation).every(Boolean);
    updateValidation(areAllFieldsValid);
  }, [validation]);

  const resetForm = () => {
    setName(null);
    setDates(null);
    setType(null);
  };

  useEffect(() => {
    resetForm();
  }, [handleCancel]);

  // fetch data
  useEffect(() => {
    setTypesUpdate(false);
    if (action == "edit") {
      setName(holiday.name);
      setType(holiday.type.id);
      setNote(holiday.note);
    }

    const fetchTypes = async () => {
      const types = await axios.get(TYPE_HOLIDAYS_ROUTE);
      const typesData = types.data;
      setTypes(
        typesData.map((type) => ({
          value: type.id,
          label: type.name,
        }))
      );
    };

    fetchTypes();
  }, [action, holiday, typesUpdate]);
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
            handleChange={eventHandlers.handleNameChange}
          />
        </Badge>
        <Badge title="Select type is required" validate={validation.type}>
          <SelectType
            placeholder="Select type"
            placeholderInput="Enter type"
            items={types}
            value={type}
            handleSelect={eventHandlers.handleTypeSelect}
            inputValue={typeName}
            handleInputChange={eventHandlers.handleTypeNameChange}
            handleAdd={eventHandlers.handleAddType}
            seletedColor={selectedColor}
            handleColorChange={eventHandlers.handleColorChange}
          />
        </Badge>
        <Badge title="Date is required" validate={validation.dates}>
          <RangePicker
            className="w-full"
            placeholder={["Start date", "End date"]}
            format={dateFormat}
            value={dates}
            onChange={eventHandlers.handleDatesChange}
          />
        </Badge>
      </div>
      <Result
        title={error ? error.request.statusText : null}
        subtitle={error ? error.message : null}
        open={openResult}
        handleClose={eventHandlers.handleCloseResult}
      />
      {contextHolder}
    </>
  );
};

export default AdminHoliday;
