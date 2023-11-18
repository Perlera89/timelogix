import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { EMPLOYEES_ROUTE, TYPE_TIMEOFFS_ROUTE } from '@/utils/apiRoutes'
import { message, DatePicker } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

//   components
import SelectType from '@/components/entry/SelectCustom'
import Select from '@/components/entry/Select'
import Textarea from '@/components/entry/Textarea'
import Badge from '@/components/common/Badge'
import Result from '@/components/common/Result'

dayjs.extend(customParseFormat)
const dateFormat = 'YYYY-MM-DD'

const { RangePicker } = DatePicker

const Admintimeoff = ({
  action,
  timeoff,
  setTimeoff,
  updateValidation,
  handleCancel
}) => {
  const statusOptions = {
    approve: 'approved',
    reject: 'rejected'
  }

  // states
  const [types, setTypes] = useState([])
  const [type, setType] = useState(null)
  const [typesUpdate, setTypesUpdate] = useState(false)
  const [typeName, setTypeName] = useState(null)
  const [employees, setEmployees] = useState([])
  const [employee, setEmployee] = useState(null)
  const [status, setStatus] = useState(null)
  const [dates, setDates] = useState(null)
  const [note, setNote] = useState(null)
  const [selectedColor, setSelectedColor] = useState('#606060')
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  // handlers
  const eventHandlers = {
    handleEmployeeSelect: (value) => {
      setEmployee(value)
      setTimeoff((prevData) => ({
        ...prevData,
        employee_id: value
      }))
    },
    handleStatusSelect: (value) => {
      console.log('value', value)
      setStatus(value)
      setTimeoff((prevData) => ({
        ...prevData,
        status: value
      }))
    },
    handleTypeSelect: (value) => {
      setType(value)
      setTimeoff((prevData) => ({
        ...prevData,
        type_id: value
      }))
    },
    handleTypeNameChange: (event) => {
      setTypeName(event.target.value)
    },
    handleDatesChange: (value) => {
      const selectedDates = value || []
      const startDate = selectedDates[0]
      const endDate = selectedDates[1]

      setDates(selectedDates)
      setTimeoff((prevData) => ({
        ...prevData,
        start_date: dayjs(startDate.format('YYYY-MM-DDTHH:mm:ssZ')),
        end_date: dayjs(endDate.format('YYYY-MM-DDTHH:mm:ssZ'))
      }))
    },
    handleNoteChange: (event) => {
      setNote(event.target.value)
      setTimeoff((prevData) => ({
        ...prevData,
        note: event.target.value
      }))
    },

    handleColorChange: (color) => {
      setSelectedColor(color.toHexString())
    },
    handleAddType: async (name) => {
      const existingTypes = types.map((type) => type.label)
      console.log('name', name)

      if (existingTypes.includes(name)) {
        isExistsMessage(name)
      } else {
        const type = {
          name,
          color: selectedColor
        }
        await axios
          .post(TYPE_TIMEOFFS_ROUTE, type)
          .then((res) => {
            setTypesUpdate(true)
            setTypeName(null)
          })
          .catch((error) => {
            eventHandlers.handleOpenResult()
            setError(error)
          })
      }
    },
    handleOpenResult: () => {
      setOpenResult(true)
    },
    handleCloseResult: () => {
      setOpenResult(false)
    }
  }

  const isExistsMessage = (name) => {
    messageApi.open({
      type: 'warning',
      content: `${name} already exists`,
      duration: 5
    })
  }

  // validations
  const validations = {
    employee: (value) => !!value,
    status: (value) => !!value,
    type: (value) => !!value,
    dates: (value) => !!value
  }

  const [validation, setValidation] = useState({
    employee: false,
    status: false,
    type: false,
    dates: false
  })

  // Actualizar el estado de validación
  useEffect(() => {
    setValidation({
      employee: validations.employee(employee),
      status: validations.type(status),
      type: validations.type(type),
      dates: validations.dates(dates)
    })
  }, [employee, status, dates, type])

  // Verificar los campos
  useEffect(() => {
    const areAllFieldsValid = Object.values(validation).every(Boolean)
    updateValidation(areAllFieldsValid)
  }, [validation])

  const resetForm = () => {
    setEmployee(null)
    setDates(null)
    setType(null)
    setStatus(null)
    setNote(null)
  }

  useEffect(() => {
    resetForm()
  }, [handleCancel])

  // fetch data
  useEffect(() => {
    setTypesUpdate(false)
    if (action === 'edit') {
      setEmployee(timeoff.employee.id)
      setType(timeoff.type.id)
      setDates([dayjs(timeoff.start_date), dayjs(timeoff.end_date)])
      setStatus(timeoff.status)
      setNote(timeoff.note)
    }
    const fetchTypes = async () => {
      await axios
        .get(TYPE_TIMEOFFS_ROUTE)
        .then((response) => {
          const typesData = response.data
          console.log('typesData', typesData)
          setTypes(
            typesData.map((type) => ({
              value: type.id,
              label: type.name
            }))
          )
        })
        .catch((error) => {
          eventHandlers.handleOpenResult()
          setError(error)
        })
    }
    const fetchEmployees = async () => {
      await axios
        .get(EMPLOYEES_ROUTE)
        .then((response) => {
          const employeesData = response.data
          setEmployees(
            employeesData.map((employee) => ({
              value: employee.id,
              label: employee.name
            }))
          )
        })
        .catch((error) => {
          eventHandlers.handleOpenResult()
          setError(error)
        })
    }

    fetchTypes()
    fetchEmployees()
  }, [action, typesUpdate, timeoff])

  return (
    <>
      <div className="flex flex-col gap-2 mt-4">
        <Badge
          title="Select employee is required"
          validate={validation.employee}
        >
          <Select
            placeholder="Select employee"
            value={employee}
            options={employees}
            handleSelect={eventHandlers.handleEmployeeSelect}
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
        <Badge title="Select dates is required" validate={validation.dates}>
          <RangePicker
            className="w-full"
            placeholder={['Start date', 'End date']}
            format={dateFormat}
            value={dates}
            onChange={eventHandlers.handleDatesChange}
          />
        </Badge>
        <Badge title="Select status is required" validate={validation.status}>
          <Select
            placeholder="Select status"
            options={[
              {
                label: <p className="text-green-500">Approve</p>,
                value: statusOptions.approve
              },
              {
                label: <p className="text-red-500">Reject</p>,
                value: statusOptions.reject
              }
            ]}
            value={status}
            handleSelect={eventHandlers.handleStatusSelect}
          />
        </Badge>
        <Textarea
          placeholder="Note"
          value={note}
          handleChange={eventHandlers.handleNoteChange}
        />
      </div>
      <Result
        title={error ? error.request.statusText : null}
        subtitle={error ? error.message : null}
        open={openResult}
        handleClose={eventHandlers.handleCloseResult}
      />
      {contextHolder}
    </>
  )
}

export default Admintimeoff
