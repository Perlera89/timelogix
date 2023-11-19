import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { GROUPS_ROUTE } from '@/utils/apiRoutes'
import { message } from 'antd'

//   components
import InputText from '@/components/entry/InputText'
import SelectGroup from '@/components/entry/SelectCustom'
import Textarea from '@/components/entry/Textarea'
import Badge from '@/components/common/Badge'
import Result from '@/components/common/Result'

const AdminEmployee = ({
  action,
  employee,
  setEmployee,
  updateValidation,
  handleCancel
}) => {
  // states
  const [groups, setGroups] = useState([])
  const [group, setGroup] = useState(null)
  const [groupsUpdate, setGroupsUpdate] = useState(false)
  const [groupName, setGroupName] = useState(null)
  const [name, setName] = useState(null)
  const [selectedColor, setSelectedColor] = useState('#606060')
  const [note, setNote] = useState(null)
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  // handlers
  const eventHandlers = {
    handleNameChange: (value) => {
      setName(value.trimStart())

      setEmployee((prevData) => ({
        ...prevData,
        name: value.trimStart()
      }))
    },
    handleGroupSelect: (value) => {
      console.log('valor del grupo', value)
      setGroup(value)
      setEmployee((prevData) => ({
        ...prevData,
        group_id: value
      }))
    },
    handleGroupNameChange: (event) => {
      setGroupName(event.target.value)
    },
    handleNoteChange: (event) => {
      setNote(event.target.value)
      setEmployee((prevData) => ({
        ...prevData,
        note: event.target.value
      }))
    },

    handleColorChange: (color) => {
      setSelectedColor(color.toHexString())
    },

    handleAddGroup: async (name) => {
      const existingGroups = groups.map((group) => group.label)

      if (existingGroups.includes(name)) {
        isExistsMessage(name)
      } else {
        const group = {
          name,
          color: selectedColor
        }
        await axios
          .post(GROUPS_ROUTE, group)
          .then((res) => {
            console.log(res)
            setGroupsUpdate(true)
            setGroupName(null)
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
    group: (value) => !!value
  }

  const [validation, setValidation] = useState({
    name: false,
    group: false
  })

  // Actualizar el estado de validación
  useEffect(() => {
    setValidation({
      name: validations.name(name),
      group: validations.group(group)
    })
  }, [name, group])

  // Verificar los campos
  useEffect(() => {
    const areAllFieldsValid = Object.values(validation).every(Boolean)
    updateValidation(areAllFieldsValid)
  }, [validation])

  const resetForm = () => {
    setName(null)
    setGroup(null)
    setNote(null)
  }

  useEffect(() => {
    resetForm()
  }, [handleCancel])

  // fetch data
  useEffect(() => {
    if (action === 'edit') {
      setName(employee.name)
      setGroup(employee.group.id)
      setNote(employee.note)
    }

    const fetchGroups = async () => {
      const groups = await axios.get(GROUPS_ROUTE)
      const groupsData = groups.data
      setGroups(
        groupsData.map((group) => ({
          value: group.id,
          label: group.name
        }))
      )
    }
    setGroupsUpdate(false)

    fetchGroups()
  }, [action, groupsUpdate, employee])
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
        <Badge title="Select group is required" validate={validation.group}>
          <SelectGroup
            placeholder="Select group"
            placeholderInput="Enter group"
            items={groups}
            value={group}
            handleSelect={eventHandlers.handleGroupSelect}
            inputValue={groupName}
            handleInputChange={eventHandlers.handleGroupNameChange}
            handleAdd={eventHandlers.handleAddGroup}
            seletedColor={selectedColor}
            handleColorChange={eventHandlers.handleColorChange}
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
        error={error ? error.stack : null}
        open={openResult}
        handleClose={eventHandlers.handleCloseResult}
      />
      {contextHolder}
    </>
  )
}

export default AdminEmployee
