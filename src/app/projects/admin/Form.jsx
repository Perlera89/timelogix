import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TYPE_PROJECTS_ROUTE } from '@/utils/apiRoutes'
import { message } from 'antd'

//   components
import SelectType from '@/components/entry/SelectCustom'
import InputText from '@/components/entry/InputText'
import Input from '@/components/entry/Input'
import Badge from '@/components/common/Badge'
import Result from '@/components/common/Result'

const Adminproject = ({
  action,
  project,
  setProject,
  updateValidation,
  handleCancel
}) => {
  // states
  const [name, setName] = useState(null)
  const [code, setCode] = useState(null)
  const [types, setTypes] = useState([])
  const [type, setType] = useState(null)
  const [typesUpdate, setTypesUpdate] = useState(false)
  const [typeName, setTypeName] = useState(null)
  const [selectedColor, setSelectedColor] = useState('#606060')
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  // handlers
  const eventHandlers = {
    handleNameChange: (value) => {
      setName(value.trimStart())

      setProject((prevData) => ({
        ...prevData,
        name: value.trimStart()
      }))
    },
    handleCodeChange: (value) => {
      setCode(event.target.value.trim())

      setProject((prevData) => ({
        ...prevData,
        code: event.target.value.trim()
      }))
    },
    handleTypeSelect: (value) => {
      setType(value)
      setProject((prevData) => ({
        ...prevData,
        type_id: value
      }))
    },
    handleTypeNameChange: (event) => {
      setTypeName(event.target.value)
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
          .post(TYPE_PROJECTS_ROUTE, type)
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
    name: (value) => !!value && value.length >= 3,
    code: (value) => !!value && value.length >= 3,
    type: (value) => !!value
  }

  const [validation, setValidation] = useState({
    name: false,
    code: false,
    type: false
  })

  // Actualizar el estado de validación
  useEffect(() => {
    setValidation({
      name: validations.name(name),
      code: validations.code(code),
      type: validations.type(type)
    })
  }, [name, code, type])

  // Verificar los campos
  useEffect(() => {
    const areAllFieldsValid = Object.values(validation).every(Boolean)
    updateValidation(areAllFieldsValid)
  }, [validation])

  const resetForm = () => {
    setName(null)
    setType(null)
    setCode(null)
  }

  useEffect(() => {
    resetForm()
  }, [handleCancel])

  const fetchTypes = async () => {
    await axios
      .get(TYPE_PROJECTS_ROUTE)
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

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      await fetchTypes()
    }
    fetchData()

    if (action === 'edit') {
      setName(project.name)
      setType(project.type.id)
      setCode(project.code)
    }
    setTypesUpdate(false)
  }, [action, typesUpdate])

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
      </div>
      <Result
        title={error ? error?.request?.statusText : null}
        subtitle={error ? error?.message : null}
        open={openResult}
        handleClose={eventHandlers.handleCloseResult}
      />
      {contextHolder}
    </>
  )
}

export default Adminproject
