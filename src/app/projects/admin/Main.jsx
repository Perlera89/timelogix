'use client'
import { Button, Tag, Popconfirm, Typography, message } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

// components
import Table from '@/components/common/Table'
import Search from '@/components/entry/Search'
import Dropdown from '@/components/common/Dropdown'
import Card from '@/components/common/CardItem'
import Avatar from '@/components/common/Avatar'
import Modal from '@/components/Modal'
import Drawer from '@/components/common/DrawerItem'
import Result from '@/components/common/Result'

import FormPage from './Form'
import ViewPage from './View'

// icon
import { FaUsers } from 'react-icons/fa'
import {
  MdRemoveRedEye,
  MdEdit,
  MdDelete,
  MdKeyboardReturn
} from 'react-icons/md'

import { PROJECTS_ROUTE, TYPE_PROJECTS_ROUTE } from '@/utils/apiRoutes'

const { Text } = Typography

const ProjectsPage = () => {
  // states
  const [project, setProject] = useState({})
  const [allProjects, setAllProjects] = useState([])
  const [projects, setProjects] = useState([])
  const [projectsCount, setProjectsCount] = useState(0)
  const [projectsUpdate, setProjectsUpdate] = useState(false)
  const [deletedProjects, setDeletedProjects] = useState([])
  const [types, setTypes] = useState([])
  const [typesCount, setTypesCount] = useState(0)
  const [openProject, setOpenProject] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedTypeName, setSelectedTypeName] = useState('All')
  const [action, setAction] = useState('add')
  const [isProjectValidated, setIsProjectValidated] = useState(false)
  const [clearModal, setClearModal] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [openResult, setOpenResult] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  // fetch data
  // -- project
  const fetchprojects = async () => {
    setProjectsUpdate(false)
    try {
      const response = await axios.get(PROJECTS_ROUTE)
      console.log('response', response)
      const projectsData = response.data.filter(
        (project) => project.is_deleted === false
      )
      setProjects(projectsData)
      setProjectsCount(projectsData.length)

      const deletedprojectsData = response.data.filter(
        (project) => project.is_deleted
      )
      setDeletedProjects(deletedprojectsData)

      setAllProjects(projectsData)
      setLoading(false)
    } catch (error) {
      eventHandlers.handleOpenResult()
      setError(error)
    }
  }

  // -- types
  const fetchtypes = async () => {
    try {
      const response = await axios.get(TYPE_PROJECTS_ROUTE)
      setTypesCount(response.data.length)
      setTypes(response.data)
    } catch (error) {
      eventHandlers.handleOpenResult()
      setError(error)
    }
  }

  useEffect(() => {
    fetchprojects()
    fetchtypes()
    setSelectedTypeName('All')

    if (selectedType === 'all') {
      setProjects(allProjects)
    } else {
      setProjects(
        projects.filter((project) => project.type.id === selectedType)
      )
    }
  }, [projectsUpdate])

  // handlers
  const eventHandlers = {
    handleSetProject: (data) => {
      setProject(data)
    },
    handleOpenProject: (project) => {
      setProject(project)
      setOpenProject(true)
    },
    handleCloseProject: () => {
      setOpenProject(false)
    },
    handleOpenResult: () => {
      setOpenResult(true)
    },
    handleCloseResult: () => {
      setOpenResult(false)
    },
    handleEditProject: (project) => {
      setProject(project)
      eventHandlers.handleOpenModal()
    },
    handleOpenModal: () => {
      setOpenModal(true)
    },
    handleCloseModal: () => {
      setClearModal(!clearModal)
      setOpenModal(false)
    },
    handleSearchChange: (value) => {
      setProjects(value)
    },
    handleProjectValidation: (isValidated) => {
      setIsProjectValidated(isValidated)
    },
    handleSaveProject: async () => {
      try {
        if (action === 'add') {
          const response = await axios.post(PROJECTS_ROUTE, project)
          const newProject = response.data
          console.log('project saved succesfully', newProject)
          setProjectsUpdate(true)
          messages.addSuccess(project.name)
          eventHandlers.handleCloseModal()
        } else {
          const response = await axios.put(
            `${PROJECTS_ROUTE}/${project.id}`,
            project
          )

          const updatedproject = response.data
          setProjectsUpdate(true)
          messages.editSuccess(updatedproject.name)
          eventHandlers.handleCloseModal()
        }
      } catch (error) {
        eventHandlers.handleOpenResult()
        setError(error)
      }
    },
    handleDeleteProject: async (project) => {
      try {
        const id = project.id
        await axios.put(`${PROJECTS_ROUTE}/${id}/delete`)
        setProjectsUpdate(true)
        messages.deletedSuccess()
      } catch (error) {
        setError(error)
        eventHandlers.handleOpenResult()
      }
    },
    handleRestoreProject: async (project) => {
      try {
        const id = project.id
        const name = project.name
        await axios.put(`${PROJECTS_ROUTE}/${id}/restore`)
        setProjectsUpdate(true)
        messages.restoredSuccess(name)
      } catch (error) {
        setError(error)
        eventHandlers.handleOpenResult()
      }
    },
    handleFilterChange: (value) => {
      setSelectedType(value)
      filterprojects(value)
    }
  }

  // message
  const messages = {
    addSuccess: (name) => {
      messageApi.open({
        type: 'success',
        content: `${name} saved successfully`,
        duration: 5
      })
    },
    editSuccess: (name) => {
      messageApi.open({
        type: 'success',
        content: `${name} updated successfully`,
        duration: 5
      })
    },
    deletedSuccess: () => {
      messageApi.open({
        type: 'success',
        content: 'deleted successfully',
        duration: 5
      })
    },
    restoredSuccess: (name) => {
      messageApi.open({
        type: 'success',
        content: `${name} restored successfully`,
        duration: 5
      })
    }
  }

  // filters
  const filters = [
    {
      label: 'All',
      key: 'all'
    },
    {
      type: 'divider'
    },
    ...types.map((type) => ({
      label: type.name,
      key: type.id
    })),
    {
      label: (
        <span className="flex gap-1 items-center">
          <MdDelete />
          Deleted
        </span>
      ),
      key: 'deleted',
      danger: true
    }
  ]

  const filterprojects = (key) => {
    if (key === 'all') {
      setProjectsUpdate(true)
      setSelectedTypeName('All')
      setProjects(allProjects)
    } else if (key === 'deleted') {
      setProjects(deletedProjects)
      setSelectedTypeName('Deleted')
    } else {
      const filter = allProjects.filter(
        (project) => project.type_id === Number(key)
      )
      setProjects(filter)
      const typeFilter = types.find((type) => type.id === Number(key))
      setSelectedTypeName(typeFilter.name)
    }
  }

  const filterProps = {
    items: filters,
    onClick: (value) => {
      eventHandlers.handleFilterChange(value.key)
    }
  }

  const columns = [
    {
      title: '',
      dataIndex: 'id',
      width: '50px',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'project',
      dataIndex: 'name'
    },
    {
      title: 'project',
      dataIndex: 'name'
    },
    {
      title: 'type',
      dataIndex: 'type',
      align: 'center'
    },
    {
      title: 'Activities',
      dataIndex: 'activities',
      align: 'center'
    },
    {
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      width: '100px'
    }
  ]

  const projectRows = projects?.map((project, key) => {
    return {
      key,
      id: project.id,
      name: (
        <div className="flex gap-4 items-center">
          <Avatar letter="D" size="large">
            <p className="text-lg">{project.name[0]}</p>
          </Avatar>
          <div className="flex flex-col">
            <Text>{project.name}</Text>
          </div>
        </div>
      ),
      type: (
        <Tag bordered={false} color={project.type.color}>
          {project.type.name}
        </Tag>
      ),
      joinDate: dayjs(project.join_date).add(1, 'day').format('MMM, DD YYYY'),
      firstIn: project.first_in
        ? dayjs(project.first_in).add(1, 'day').format('HH:mm')
        : 'No hour',
      lastOut: project.last_aut
        ? dayjs(project.last_aut).add(1, 'day').format('HH:mm')
        : 'No hour',
      actions: project.is_deleted
        ? (
        <Popconfirm
          title={`Restore ${project.name}`}
          description="Are you sure you want to restore this project?"
          onConfirm={() => eventHandlers.handleRestoreproject(project)}
          okType="danger"
          placement="topLeft"
          okText="Si"
          cancelText="No"
        >
          <Button
            type="text"
            icon={<MdKeyboardReturn title="Restore project" />}
            className="text-green-500 flex items-center justify-center"
          />
        </Popconfirm>
          )
        : (
        <div className="flex justify-center">
          <Button
            type="text"
            icon={<MdRemoveRedEye title="View project" />}
            className="text-blue-500 flex items-center justify-center"
            onClick={() => eventHandlers.handleOpenProject(project)}
            disabled={project.is_deleted}
          />
          <Button
            type="text"
            icon={<MdEdit title="Edit project" />}
            className="text-green-500 flex items-center justify-center"
            onClick={() => {
              eventHandlers.handleEditProject(project)
              setAction('edit')
            }}
            disabled={project.is_deleted}
          />
          <Popconfirm
            title={`Delete ${project.name}`}
            description="Are you sure to delete this project?"
            onConfirm={() => eventHandlers.handleDeleteProject(project)}
            okType="danger"
            placement="topLeft"
            okText="Si"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<MdDelete title="Delete project" />}
              className="text-red-500 flex items-center justify-center"
              disabled={project.is_deleted}
            />
          </Popconfirm>
        </div>
          )
    }
  })

  return (
    <>
      <div className="mb-4 flex gap-4">
        <Card cardTitle="Total projects" filterItems={null}>
          <div className="grid gap-2">
            <FaUsers className="text-5xl text-blue-500 bg-blue-500/10 p-2.5 rounded-xl" />
            <p className="text-blue-500 text-xl ml-2">{projectsCount}</p>
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button
          className="mb-4"
          onClick={() => {
            eventHandlers.handleOpenModal()
            setAction('add')
          }}
        >
          Add project
        </Button>
        <div className="mb-4 flex justify-end">
          <Search
            text="Search project"
            options={allProjects}
            update={setProjectsUpdate}
            onSearch={eventHandlers.handleSearchChange}
          />
          <div className="flex justify-end">
            <Dropdown
              title={selectedTypeName}
              filters={filterProps}
            ></Dropdown>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        data={projectRows || []}
        locale={{ emptyText: 'No projects' }}
        loading={loading}
      />
      <Drawer
        title="View project"
        placement="right"
        isOpen={openProject}
        isClose={eventHandlers.handleCloseProject}
      >
        <ViewPage project={project} />
      </Drawer>
      <Modal
        title="Add project"
        width={500}
        isModalOpen={openModal}
        handleCancel={eventHandlers.handleCloseModal}
        handleSave={eventHandlers.handleSaveProject}
        validate={!isProjectValidated}
      >
        <FormPage
          action={action}
          project={project}
          setproject={eventHandlers.handleSetProject}
          updateValidation={eventHandlers.handleProjectValidation}
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
  )
}

export default ProjectsPage
