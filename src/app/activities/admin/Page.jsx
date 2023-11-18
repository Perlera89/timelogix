'use client'
import { Button, Tag, Popconfirm, message, Radio } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'

// components
import Table from '@/components/common/Table'
import Search from '@/components/entry/Search'
import Select from '@/components/entry/Select'
import Card from '@/components/common/CardItem'
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

import { ACTIVITIES_ROUTE, EMPLOYEES_ROUTE } from '@/utils/apiRoutes'

const activitysPage = () => {
  // states
  const [activity, setActivity] = useState({})
  const [allActivities, setAllActivities] = useState([])
  const [activities, setActivities] = useState([])
  const [activitiesCount, setActivitiesCount] = useState(0)
  const [activitiesUpdate, setActivitiesUpdate] = useState(false)
  const [newActivitySaved, setNewActivitySaved] = useState(false)
  const [deletedActivities, setDeletedActivities] = useState([])
  const [employees, setEmployees] = useState(null)
  const [employeesData, setEmployeesData] = useState(null)
  const [employee, setEmployee] = useState(null)
  const [employeesId, setEmployeesId] = useState(null)
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
  const fetchActivitys = async () => {
    try {
      const response = await axios.get(ACTIVITIES_ROUTE)
      console.log('response.data', response.data)
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
        setEmployeesData(response.data)
        const employeesData = response.data.map((employee) => ({
          value: employee.id,
          label: employee.name
        }))

        console.log('employeesData', employeesData)
        setEmployees(employeesData)
      })
      .catch((error) => {
        setError(error)
        eventHandlers.handleOpenResult()
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchEmployees()
      await fetchActivitys()
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
      eventHandlers.handleFilterChange(value)
    },
    handleSaveActivity: async () => {
      try {
        if (action === 'add') {
          setEmployeesId(activity.employees)
          const response = await axios.post(ACTIVITIES_ROUTE, activity)
          const newActivity = response.data
          setActivity(newActivity)
          console.log('activity saved succesfully', newActivity)
          messages.addSuccess(activity.name)
          setNewActivitySaved(true)

          eventHandlers.handleCloseModal()
        } else {
          const response = await axios.put(
            `${ACTIVITIES_ROUTE}/${activity.id}`,
            activity
          )

          const updatedactivity = response.data
          setActivity(updatedactivity)
          setActivitiesUpdate(true)
          setNewActivitySaved(true)
          messages.editSuccess(updatedactivity.name)
        }
      } catch (error) {
        setError(error)
        eventHandlers.handleOpenResult()
      }
    },
    handleDeleteActivity: async (activity) => {
      try {
        const id = activity.id
        await axios.put(`${ACTIVITIES_ROUTE}/${id}/delete`)
        setActivitiesUpdate(true)
        messages.deletedSuccess()
      } catch (error) {
        setError(error)
        eventHandlers.handleOpenResult()
      }
    },
    handleRestoreactivity: async (activity) => {
      try {
        const id = activity.id
        const name = activity.name
        await axios.put(`${ACTIVITIES_ROUTE}/${id}/restore`)
        setActivitiesUpdate(true)
        messages.restoredSuccess(name)
      } catch (error) {
        setError(error)
        eventHandlers.handleOpenResult()
      }
    },
    handleFilterChange: (value) => {
      filterActivities(value)
    }
  }

  // Luego de ingresar la actividad se actualizan los empleados
  useEffect(() => {
    const updateEmployee = async () => {
      if (newActivitySaved) {
        await employeesId.forEach(async (employeeId) => {
          console.log('employeeId', employeeId)
          const data = employeesData.find(
            (employee) => employee.id === Number(employeeId)
          )
          data.activity_id = activity.id
          console.log('data', data)
          await axios
            .put(`${EMPLOYEES_ROUTE}/${data.id}`, data)
            .then((res) => console.log('res', res))
            .catch((err) => {
              setError(err)
              eventHandlers.handleOpenResult()
            })
        })
      }
    }
    updateEmployee()
    setNewActivitySaved(false)
    eventHandlers.handleCloseModal()
    setActivitiesUpdate(true)
  }, [newActivitySaved])

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

  const filterActivities = (value) => {
    console.log('value', value)
    const filteredActivities = allActivities.filter((activity) =>
      activity.employees.some((employee) => employee.id === value)
    )

    setActivities(filteredActivities)
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

  const activityRows = activities?.map((activity, key) => {
    return {
      key,
      id: activity.id,
      color: <Tag className="p-2 rounded-full" color={activity.color} />,
      name: activity.name,
      code: activity.code,
      employees: activity.employees.map((employee) => (
        <Tag key={employee.id} bordered={false} color="blue">
          {employee.name}
        </Tag>
      )),
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
        <div className="mb-4 flex justify-end">
          <Search
            text="Search activity"
            options={allActivities}
            update={setActivitiesUpdate}
            onSearch={eventHandlers.handleSearchChange}
          />
          <div className="flex gap-4">
            <Select
              placeholder="Select a employee"
              value={employee}
              options={employees}
              handleSelect={eventHandlers.handleEmployeeSelect}
            />
            <Radio.Group
              className="w-52"
              defaultValue="all"
              options={[
                { label: 'All', value: 'all' },
                { label: 'Deleted', value: 'deleted' }
              ]}
              onChange={(e) => {
                const value = e.target.value
                if (value === 'all') {
                  setActivities(allActivities)
                } else if (value === 'deleted') {
                  setActivities(deletedActivities)
                }
              }}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        data={activityRows}
        locale={{ emptyText: 'No activities' }}
        loading={loading}
      />
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

export default activitysPage
