import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { EMPLOYEES_ROUTE } from '@/utils/apiRoutes'

//   components
import InputText from '@/components/entry/InputText'
import Input from '@/components/entry/Input'
import ColorPicker from '@/components/entry/ColorPicker'
import MultipleSelect from '@/components/entry/MultipleSelect'
import Textarea from '@/components/entry/Textarea'
import Badge from '@/components/common/Badge'
import Result from '@/components/common/Result'

const AdminActivity = ({
  action,
  activity,
  setActivity,
  updateValidation,
  handleCancel
}) => {
  // states
  const [name, setName] = useState(null)
  const [code, setCode] = useState(null)
  const [description, setDescription] = useState(null)
  const [employeesData, setEmployeesData] = useState(null)
  const [employees, setEmployees] = useState(null)
  const [color, setColor] = useState('#606060')
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)

  // handlers
  const eventHandlers = {
    handleNameChange: (value) => {
      setName(value.trimStart())

      setActivity((prevData) => ({
        ...prevData,
        name: value.trimStart()
      }))
    },
    handleCodeChange: (value) => {
      setCode(event.target.value.trim())

      setActivity((prevData) => ({
        ...prevData,
        code: event.target.value.trim()
      }))
    },
    handleEmployeeSelect: (value) => {
      setEmployees(value)
      setActivity((prevData) => ({
        ...prevData,
        employees: value
      }))
    },
    handleDescriptionChange: (event) => {
      setDescription(event.target.value)
      setActivity((prevData) => ({
        ...prevData,
        description: event.target.value
      }))
    },
    handleColorChange: (color) => {
      setColor(color.toHexString())
      setActivity((prevData) => ({
        ...prevData,
        color: color.toHexString()
      }))
    },
    handleOpenResult: () => {
      setOpenResult(true)
    },
    handleCloseResult: () => {
      setOpenResult(false)
    }
  }

  // validations
  const validations = {
    name: (value) => !!value && value.length >= 3,
    code: (value) => !!value && value.length >= 3,
    employees: (value) => !!value
  }

  const [validation, setValidation] = useState({
    name: false,
    code: false,
    employees: false
  })

  // Actualizar el estado de valid  ación
  useEffect(() => {
    setValidation({
      name: validations.name(name),
      code: validations.code(code),
      employees: validations.employees(employees)
    })
  }, [name, code, employees])

  // Verificar los campos
  useEffect(() => {
    const areAllFieldsValid = Object.values(validation).every(Boolean)
    updateValidation(areAllFieldsValid)
  }, [validation])

  const resetForm = () => {
    setName(null)
    setCode(null)
    setEmployees(null)
    setColor(null)
  }

  useEffect(() => {
    resetForm()
  }, [handleCancel])

  // fetch data
  useEffect(() => {
    if (action === 'edit') {
      setName(activity.name)
      setCode(activity.code)
      setEmployees(activity.employees.map((employee) => employee.id))
      setColor(activity.color)
      setDescription(activity.description)
    }

    const fetchEmployees = async () => {
      await axios
        .get(EMPLOYEES_ROUTE)
        .then((response) => {
          setEmployeesData(
            response.data.map((employee) => ({
              value: employee.id,
              label: employee.name
            }))
          )
        })
        .catch((error) => {
          setError(error)
          eventHandlers.handleOpenResult()
        })
    }

    fetchEmployees()
  }, [action, activity])
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
        <Badge
          title="Code is required: minimum 3 chareacteres"
          validate={validation.code}
        >
          <Input
            placeholder="Code"
            value={code}
            handleChange={eventHandlers.handleCodeChange}
          />
        </Badge>
        <Badge title="Select group is required" validate={validation.employees}>
          <MultipleSelect
            placeholder="Select employees"
            handleSelect={eventHandlers.handleEmployeeSelect}
            options={employeesData}
          />
        </Badge>
        <ColorPicker
          selectedColor={color}
          value={color}
          handleColorChange={eventHandlers.handleColorChange}
        />
        <Textarea
          placeholder="Description"
          value={description}
          handleChange={eventHandlers.handleDescriptionChange}
        />
      </div>
      <Result
        title={error ? error.request.statusText : null}
        subtitle={error ? error.message : null}
        error={error ? error.stack : null}
        open={openResult}
        handleClose={eventHandlers.handleCloseResult}
      />
    </>
  )
}

export default AdminActivity
