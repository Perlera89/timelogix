import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PROJECTS_ROUTE } from '@/utils/apiRoutes'

//   components
import InputText from '@/components/entry/InputText'
import Input from '@/components/entry/Input'
import Select from '@/components/entry/Select'
import ColorPicker from '@/components/entry/ColorPicker'
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
  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(null)
  const [description, setDescription] = useState(null)
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
    handleProjectSelect: (value) => {
      setProject(value)
      setActivity((prevData) => ({
        ...prevData,
        project_id: value
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
    project: (value) => !!value
  }

  const [validation, setValidation] = useState({
    name: false,
    code: false,
    project: false
  })

  // Actualizar el estado de valid  ación
  useEffect(() => {
    setValidation({
      name: validations.name(name),
      code: validations.code(code),
      project: validations.project(project)
    })
  }, [name, code, project])

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

  const fetchProjects = async () => {
    await axios
      .get(PROJECTS_ROUTE)
      .then((response) => {
        const projectsData = response.data.filter(
          (project) => project.is_deleted === false
        )
        setProjects(
          projectsData.map((project) => ({
            value: project.id,
            label: project.name
          }))
        )
      })
      .catch((error) => {
        eventHandlers.handleOpenResult()
        setError(error)
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchProjects()
    }
    fetchData()

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
        <Badge
          title="Select employee is required"
          validate={validation.project}
        >
          <Select
            placeholder="Select project"
            value={project}
            options={projects}
            handleSelect={eventHandlers.handleProjectSelect}
          />
        </Badge>
        <ColorPicker
          rootClassName="max-w-[100px]"
          selectedColor={color}
          handleColorChange={eventHandlers.handleColorChange}
        />
        <Textarea
          placeholder="Description"
          value={description}
          handleChange={eventHandlers.handleDescriptionChange}
        />
        <Result
          title={error ? error?.request?.statusText : null}
          subtitle={error ? error?.message : null}
          open={openResult}
          handleClose={eventHandlers.handleCloseResult}
        />
      </div>
    </>
  )
}

export default AdminActivity
