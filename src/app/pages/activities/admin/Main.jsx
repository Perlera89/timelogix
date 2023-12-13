'use client'
import { Button, Tag, Popconfirm, message } from 'antd'
import axios from 'axios'
import { Suspense, useEffect, useMemo, useState } from 'react'

// components
import Table from '@/components/common/Table'
import Search from '@/components/entry/Search'
import Select from '@/components/entry/Select'
import Card from '@/components/common/CardItem'
import Modal from '@/components/Modal'
import Drawer from '@/components/common/DrawerItem'
import Result from '@/components/common/Result'
import Avatar from '@/components/common/Avatar'
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
import {
  ACTIVITIES_ROUTE,
  EMPLOYEES_ROUTE,
  PROJECTS_ROUTE
} from '@/utils/apiRoutes'

const ActivitiesPage = () => {
  // states
  const [activity, setActivity] = useState({})
  const [allActivities, setAllActivities] = useState([])
  const [activities, setActivities] = useState([])
  const [activitiesCount, setActivitiesCount] = useState(0)
  const [activitiesUpdate, setActivitiesUpdate] = useState(false)
  const [deletedActivities, setDeletedActivities] = useState([])
  const [statusValue, setStatusValue] = useState('all')
  const [employees, setEmployees] = useState(null)
  const [employee, setEmployee] = useState(null)
  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(null)
  const [openActivity, setOpenActivity] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [action, setAction] = useState('add')
  const [isActivityValidated, setIsActivityValidated] = useState(false)
  const [clearModal, setClearModal] = useState(false)
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)
  const [loading, setLoading] = useState(true)

  const [messageApi, contextHolder] = message.useMessage()

  // fetch data
  // -- activity
  const fetchActivities = async () => {
    try {
      const response = await axios.get(ACTIVITIES_ROUTE)
      const activitiesData = response.data.filter(
        (activity) => activity.is_deleted === false
      )
      setActivities(activitiesData)
      setActivitiesCount(activitiesData.length)

      const deletedActivitiesData = response.data.filter(
        (activity) => activity.is_deleted
      )

      console.log('deletedActivitiesData', deletedActivitiesData)
      setDeletedActivities(deletedActivitiesData)

      setAllActivities(activitiesData)
      setLoading(false)
    } catch (error) {
      eventHandlers.handleOpenResult()
      setError(error)
    }
  }

  const fetchEmployees = async () => {
    await axios
      .get(EMPLOYEES_ROUTE)
      .then((response) => {
        const employeesData = response.data.map((employee) => ({
          value: employee.id,
          label: employee.name
        }))

        setEmployees(employeesData)
      })
      .catch((error) => {
        setError(error)
        eventHandlers.handleOpenResult()
      })
  }

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
        setError(error)
        eventHandlers.handleOpenResult()
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchActivities()
      await fetchProjects()
      await fetchEmployees()
      setActivitiesUpdate(false)
    }
    fetchData()
  }, [activitiesUpdate])

  // handlers
  const eventHandlers = {
    handleSetActivity: (data) => {
      setActivity(data)
    },
    handleOpenActivity: (activity) => {
      setActivity(activity)
      setOpenActivity(true)
    },
    handleCloseActivity: () => {
      setOpenActivity(false)
    },
    handleOpenResult: () => {
      setOpenResult(true)
    },
    handleCloseResult: () => {
      setOpenResult(false)
    },
    handleEditActivity: (activity) => {
      setActivity(activity)
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
      setActivities(value)
    },
    handleActivityValidation: (isValidated) => {
      setIsActivityValidated(isValidated)
    },
    handleEmployeeSelect: (value) => {
      setEmployee(value)
      eventHandlers.handleFilterChange(value, 'employee')
    },
    handleProjectSelect: (value) => {
      setProject(value)
      eventHandlers.handleFilterChange(value, 'project')
    },
    handleFilterChange: (value, filter) => {
      filterProps(value, filter)
    },
    handleSaveActivity: async () => {
      try {
        if (action === 'add') {
          const response = await axios.post(ACTIVITIES_ROUTE, activity)
          const newActivity = response.data
          setActivity(newActivity)
          console.log('activity saved succesfully', newActivity)
          messages.addSuccess(activity.name)

          eventHandlers.handleCloseModal()
        } else {
          const response = await axios.put(
            `${ACTIVITIES_ROUTE}/${activity.id}`,
            activity
          )

          const updatedactivity = response.data
          setActivity(updatedactivity)
          setActivitiesUpdate(true)
          messages.editSuccess(updatedactivity.name)
        }

        eventHandlers.handleCloseModal()
        setActivitiesUpdate(true)
      } catch (error) {
        setError(error)
        eventHandlers.handleOpenResult()
      }
    },
    handleDeleteActivity: async (activity) => {
      const id = activity.id
      await axios
        .put(`${ACTIVITIES_ROUTE}/${id}/delete`)
        .then((response) => {
          setActivitiesUpdate(true)
          messages.deletedSuccess()
        })
        .catch((error) => {
          setError(error)
          eventHandlers.handleOpenResult()
        })
    },
    handleRestoreactivity: async (activity) => {
      const id = activity.id
      await axios
        .put(`${ACTIVITIES_ROUTE}/${id}/restore`)
        .then((response) => {
          setActivitiesUpdate(true)
          messages.deletedSuccess()
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

  const filterProps = (value, filter) => {
    setStatusValue('all')
    let filteredActivities = []
    if (filter === 'project') {
      setEmployee(null)
      filteredActivities = allActivities.filter(
        (activity) => activity.project.id === value
      )
    } else if (filter === 'employee') {
      setProject(null)
      filteredActivities = allActivities.filter(
        (activity) => activity.employee.id === value
      )
    }

    setEmployees(filteredActivities)
  }

  const columns = [
    {
      title: '',
      dataIndex: 'id',
      width: '50px',
      sorter: (a, b) => a.id - b.id
    },
    {
      dataIndex: 'color',
      width: '50px'
    },
    {
      title: 'Activity',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Code',
      dataIndex: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code)
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      align: 'center'
    },
    {
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      width: '100px'
    }
  ]

  const activityRows = useMemo(() => {
    return activities?.map((activity, key) => {
      return {
        key,
        id: activity.id,
        color: <Tag className="p-2 rounded-full" color={activity.color} />,
        name: activity.name,
        code: activity.code,
        employees: (
          <div className="flex flex-wrap justify-start gap-4">
            {activity.employees.map((employee) => (
              <div key={employee.id} className="flex gap-2 items-center">
                <Avatar>
                  <p className="text-lg">{employee.name[0]}</p>
                </Avatar>
                <div className="flex flex-col">
                  <p>{employee.name}</p>
                </div>
              </div>
            ))}
          </div>
        ),
        actions: activity.is_deleted
          ? (
          <Popconfirm
            title={`Restore ${activity.name}`}
            description="Are you sure you want to restore this activity?"
            onConfirm={() => eventHandlers.handleRestoreactivity(activity)}
            okType="danger"
            placement="topLeft"
            okText="Si"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<MdKeyboardReturn title="Restore activity" />}
              className="text-green-500 flex items-center justify-center"
            />
          </Popconfirm>
            )
          : (
          <div className="flex justify-center">
            <Button
              type="text"
              icon={<MdRemoveRedEye title="View activity" />}
              className="text-blue-500 flex items-center justify-center"
              onClick={() => eventHandlers.handleOpenActivity(activity)}
              disabled={activity.is_deleted}
            />
            <Button
              type="text"
              icon={<MdEdit title="Edit activity" />}
              className="text-green-500 flex items-center justify-center"
              onClick={() => {
                eventHandlers.handleEditActivity(activity)
                setAction('edit')
              }}
              disabled={activity.is_deleted}
            />
            <Popconfirm
              title={`Delete ${activity.name}`}
              description="Are you sure to delete this activity?"
              onConfirm={() => eventHandlers.handleDeleteActivity(activity)}
              okType="danger"
              placement="topLeft"
              okText="Si"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<MdDelete title="Delete activity" />}
                className="text-red-500 flex items-center justify-center"
                disabled={activity.is_deleted}
              />
            </Popconfirm>
          </div>
            )
      }
    })
  }, [activities])

  return (
    <>
      <div className="mb-4 flex gap-4">
        <Card cardTitle="Total activities">
          <div className="grid gap-2">
            <FaUsers className="text-5xl text-blue-500 bg-blue-500/10 p-2.5 rounded-xl" />
            <p className="text-blue-500 text-xl ml-2">{activitiesCount}</p>
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
          Add activity
        </Button>
        <div className="flex mb-4 gap-4 justify-end">
          <Search
            text="Search activity"
            options={allActivities}
            update={setActivitiesUpdate}
            onSearch={eventHandlers.handleSearchChange}
          />
          <Select
            bordered={false}
            placeholder="Select employee"
            value={employee}
            options={employees}
            handleSelect={eventHandlers.handleEmployeeSelect}
          />
          <Select
            bordered={false}
            placeholder="Select project"
            value={project}
            options={projects}
            handleSelect={eventHandlers.handleProjectSelect}
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
                setActivities(allActivities)
              } else {
                setActivities(deletedActivities)
              }
            }}
          />
        </div>
      </div>
      <Suspense fallback={<SkeletonTable />}>
        <Table
          columns={columns}
          data={activityRows}
          locale={{ emptyText: 'No activities' }}
          loading={loading}
        />
      </Suspense>
      <Drawer
        title="View activity"
        placement="right"
        isOpen={openActivity}
        isClose={eventHandlers.handleCloseActivity}
      >
        <ViewPage activity={activity} />
      </Drawer>
      <Modal
        title="Add activity"
        width={500}
        isModalOpen={openModal}
        handleCancel={eventHandlers.handleCloseModal}
        handleSave={eventHandlers.handleSaveActivity}
        validate={!isActivityValidated}
      >
        <FormPage
          action={action}
          activity={activity}
          setActivity={eventHandlers.handleSetActivity}
          updateValidation={eventHandlers.handleActivityValidation}
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

export default ActivitiesPage
