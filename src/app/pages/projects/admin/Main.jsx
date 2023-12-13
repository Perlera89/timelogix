'use client'
import { Button, Tag, Popconfirm, message } from 'antd'
import axios from 'axios'
import { Suspense, useEffect, useMemo, useState } from 'react'

// components
import Table from '@/components/common/Table'
import Search from '@/components/entry/Search'
import Select from '@/components/entry/Select'
import Dropdown from '@/components/common/Dropdown'
import Card from '@/components/common/CardItem'
import Modal from '@/components/Modal'
import Drawer from '@/components/common/DrawerItem'
import Result from '@/components/common/Result'
import SkeletonTable from '@/components/skeleton/SkeletonTable'

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

const ProjectsPage = () => {
  // states
  const [project, setProject] = useState({})
  const [allProjects, setAllProjects] = useState([])
  const [projects, setProjects] = useState([])
  const [activities, setActivities] = useState([])
  const [activity, setActivity] = useState([])
  const [projectsCount, setProjectsCount] = useState(0)
  const [projectsUpdate, setProjectsUpdate] = useState(false)
  const [deletedProjects, setDeletedProjects] = useState([])
  const [types, setTypes] = useState([])
  const [openProject, setOpenProject] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [statusValue, setStatusValue] = useState('all')
  const [action, setAction] = useState('add')
  const [isProjectValidated, setIsProjectValidated] = useState(false)
  const [clearModal, setClearModal] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [openResult, setOpenResult] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  // fetch data
  // -- project
  const fetchProjects = async () => {
    setProjectsUpdate(false)
    await axios
      .get(PROJECTS_ROUTE)
      .then((response) => {
        console.log('response.data', response.data)
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
      })
      .catch((error) => {
        eventHandlers.handleOpenResult()
        setError(error)
      })
  }

  // -- types
  const fetchTypes = async () => {
    await axios
      .get(TYPE_PROJECTS_ROUTE)
      .then((response) => {
        setTypes(response.data)
      })
      .catch((error) => {
        eventHandlers.handleOpenResult()
        setError(error)
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchProjects()
      await fetchTypes()
    }
    fetchData()
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
    handleActivitySelect: (value) => {
      setActivity(value)
      eventHandlers.handleFilterActivityChange(value)
    },
    handleFilterActivityChange: (value) => {
      filterActivity(value)
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
      const id = project.id
      await axios
        .put(`${PROJECTS_ROUTE}/${id}/delete`)
        .then((response) => {
          setProjectsUpdate(true)
          messages.restoredSuccess()
        })
        .catch((error) => {
          setError(error)
          eventHandlers.handleOpenResult()
        })
    },
    handleRestoreProject: async (project) => {
      const id = project.id
      await axios
        .put(`${PROJECTS_ROUTE}/${id}/restored`)
        .then((response) => {
          setProjectsUpdate(true)
          messages.restoredSuccess()
        })
        .catch((error) => {
          setError(error)
          eventHandlers.handleOpenResult()
        })
    }
  }

  // message
  const messages = {
    addSuccess: (name) => showMessage('success', `${name} saved successfully`),
    editSuccess: (name) =>
      showMessage('success', `${name} updated successfully`),
    deletedSuccess: () => showMessage('success', 'Deleted successfully'),
    restoredSuccess: () => showMessage('success', 'Restored successfully')
  }

  const showMessage = (type, content) => {
    messageApi.open({
      type,
      content,
      duration: 5
    })
  }

  // filters
  const filterActivity = (value) => {
    setStatusValue('all')
    setActivities(
      allProjects.filter((project) => project.activity.id === value)
    )
  }

  const columns = [
    {
      title: '',
      dataIndex: 'id',
      width: '50px',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name - b.name
    },
    {
      title: 'Code',
      dataIndex: 'code'
    },
    {
      title: 'Type',
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

  const projectRows = useMemo(() => {
    return projects?.map((project, key) => {
      return {
        key,
        id: project.id,
        name: project.name,
        code: project.code,
        type: (
          <Tag bordered={false} color={project.type.color}>
            {project.type.name}
          </Tag>
        ),
        activities:
          project.activities.length > 0
            ? (
            <div className="flex justify-start gap-4">
              {project.activities.map((activity) => (
                <Tag key={activity.id} bordered={false} color={activity.color}>
                  {activity.code}
                </Tag>
              ))}
            </div>
              )
            : (
                'No activities'
              ),
        actions: project.is_deleted
          ? (
          <Popconfirm
            title={`Restore ${project.name}`}
            description="Are you sure you want to restore this project?"
            onConfirm={() => eventHandlers.handleRestoreProject(project)}
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
  }, [projects])

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
        <div className="flex mb-4 gap-4 justify-end">
          <Search
            text="Search project"
            options={allProjects}
            update={setProjectsUpdate}
            onSearch={eventHandlers.handleSearchChange}
          />
          <Select
            bordered={false}
            placeholder="Select activity"
            value={activity}
            options={activities}
            handleSelect={eventHandlers.handleActivitySelect}
          />
          <Select
            bordered={false}
            value={statusValue}
            placeholder="All"
            options={[
              {
                label: 'All',
                value: 'all'
              },
              { label: 'Deleted', value: 'deleted' }
            ]}
            handleSelect={(value) => {
              setStatusValue(value)
              if (value === 'all') {
                setProjects(allProjects)
              } else {
                setProjects(deletedProjects)
              }
            }}
          />
        </div>
      </div>
      <Suspense fallback={<SkeletonTable />}>
        <Table
          columns={columns}
          data={projectRows}
          locale={{ emptyText: 'No projects' }}
          loading={loading}
        />
      </Suspense>
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
          setProject={eventHandlers.handleSetProject}
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
