import React, { useState, useEffect } from 'react'

//   components
import InputText from '@/components/entry/InputText'
import Input from '@/components/entry/Input'
import ColorPicker from '@/components/entry/ColorPicker'
import Textarea from '@/components/entry/Textarea'
import Badge from '@/components/common/Badge'

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
  const [color, setColor] = useState('#606060')

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
    }
  }

  // validations
  const validations = {
    name: (value) => !!value && value.length >= 3,
    code: (value) => !!value && value.length >= 3
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
      code: validations.code(code)
    })
  }, [name, code])

  // Verificar los campos
  useEffect(() => {
    const areAllFieldsValid = Object.values(validation).every(Boolean)
    updateValidation(areAllFieldsValid)
  }, [validation])

  const resetForm = () => {
    setName(null)
    setCode(null)
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
      setColor(activity.color)
      setDescription(activity.description)
    }
  }, [action])
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
          <ColorPicker
            rootClassName='max-w-[100px]'
            selectedColor={color}
            handleColorChange={eventHandlers.handleColorChange}
          />
        <Textarea
          placeholder="Description"
          value={description}
          handleChange={eventHandlers.handleDescriptionChange}
        />
      </div>
    </>
  )
}

export default AdminActivity
