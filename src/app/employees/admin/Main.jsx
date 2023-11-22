'use client'
import { Button, Tag, Popconfirm, Typography, message } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState, useMemo, Suspense } from 'react'

// components
import Table from '@/components/common/Table'
import Dropdown from '@/components/common/Dropdown'
import Search from '@/components/entry/Search'
import Select from '@/components/entry/Select'
import Card from '@/components/common/CardItem'
import Avatar from '@/components/common/Avatar'
import Modal from '@/components/Modal'
import Drawer from '@/components/common/DrawerItem'
import Result from '@/components/common/Result'
import SkeletonTable from '@/components/skeleton/SkeletonTable'

import FormPage from './Form'
import ViewPage from './View'

// icon
import { FaUsers, FaLayerGroup } from 'react-icons/fa'
import {
  MdRemoveRedEye,
  MdEdit,
  MdDelete,
  MdKeyboardReturn
} from 'react-icons/md'

import {
  ACTIVITIES_ROUTE,
  EMPLOYEES_ROUTE,
  GROUPS_ROUTE
} from '@/utils/apiRoutes'

const { Text } = Typography

const EmployeesPage = () => {
  // states
  const [allEmployees, setAllEmployees] = useState([])
  const [employees, setEmployees] = useState([])
  const [employee, setEmployee] = useState(null)
  const [employeesCount, setEmployeesCount] = useState(0)
  const [employeesUpdate, setEmployeesUpdate] = useState(false)
  const [deletedEmployees, setDeletedEmployees] = useState([])
  const [groups, setGroups] = useState([])
  const [group, setGroup] = useState(null)
  const [activities, setActivities] = useState([])
  const [activity, setActivity] = useState(null)
  const [groupsCount, setGroupsCount] = useState(0)
  const [openEmployee, setOpenEmployee] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [action, setAction] = useState('add')
  const [statusTitle, setStatusTitle] = useState('All')
  const [isEmployeeValidated, setIsEmployeeValidated] = useState(false)
  const [clearModal, setClearModal] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [openResult, setOpenResult] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  // fetch data
  // -- employee
  const fetchEmployees = async () => {
    await axios
      .get(EMPLOYEES_ROUTE)
      .then((response) => {
        const employeesData = response.data.filter(
          (employee) => employee.is_deleted === false
        )
        setEmployees(employeesData)
        setEmployeesCount(employeesData.length)
        setAllEmployees(employeesData)

        const deletedEmployeesData = response.data.filter(
          (employee) => employee.is_deleted
        )
        setDeletedEmployees(deletedEmployeesData)

        setLoading(false)
      })
      .catch((error) => {
        eventHandlers.handleOpenResult()
        setError(error)
      })
  }

  // -- groups
  const fetchGroups = async () => {
    await axios
      .get(GROUPS_ROUTE)
      .then((response) => {
        setGroupsCount(response.data.length)
        setGroups(
          response.data.map((group) => ({
            value: group.id,
            label: group.name
          }))
        )
      })
      .catch((error) => {
        eventHandlers.handleOpenResult()
        setError(error)
      })
  }

  // -- activities
  const fetchActivities = async () => {
    await axios
      .get(ACTIVITIES_ROUTE)
      .then((response) => {
        setActivities(
          response.data.map((activity) => ({
            value: activity.id,
            label: activity.code
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
      await fetchEmployees()
      await fetchGroups()
      await fetchActivities()
    }
    fetchData()
    setEmployeesUpdate(false)
  }, [employeesUpdate])

  // handlers
  const eventHandlers = {
    handleSetEmployee: (data) => {
      setEmployee(data)
    },
    handleOpenEmployee: (employee) => {
      setEmployee(employee)
      setOpenEmployee(true)
    },
    handleCloseEmployee: () => {
      setOpenEmployee(false)
    },
    handleOpenResult: () => {
      setOpenResult(true)
    },
    handleCloseResult: () => {
      setOpenResult(false)
    },
    handleEditEmployee: (employee) => {
      setEmployee(employee)
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
      setEmployees(value)
    },
    handleEmployeeValidation: (isValidated) => {
      setIsEmployeeValidated(isValidated)
    },
    handleGroupSelect: (value) => {
      setGroup(value)
      eventHandlers.handleFilterChange(value, 'group')
    },
    handleActivitySelect: (value) => {
      setActivity(value)
      eventHandlers.handleFilterChange(value, 'activity')
    },
    handleFilterChange: (value, filter) => {
      filterProps(value, filter)
    },
    handleSaveEmployee: async () => {
      try {
        if (action === 'add') {
          await axios.post(EMPLOYEES_ROUTE, employee)
          setEmployeesUpdate(true)
          messages.addSuccess(employee.name)
          eventHandlers.handleCloseModal()
        } else {
          const response = await axios.put(
            `${EMPLOYEES_ROUTE}/${employee.id}`,
            employee
          )

          const updatedEmployee = response.data
          setEmployeesUpdate(true)
          messages.editSuccess(updatedEmployee.name)
          eventHandlers.handleCloseModal()
        }
      } catch (error) {
        eventHandlers.handleOpenResult()
        setError(error)
      }
    },
    handleDeleteEmployee: async (employee) => {
      const id = employee.id
      await axios
        .put(`${EMPLOYEES_ROUTE}/${id}/delete`)
        .then((response) => {
          setEmployeesUpdate(true)
          messages.deletedSuccess()
        })
        .catch((error) => {
          setError(error)
          eventHandlers.handleOpenResult()
        })
    },
    handleRestoreEmployee: async (employee) => {
      const id = employee.id
      await axios
        .put(`${EMPLOYEES_ROUTE}/${id}/restore`)
        .then((response) => {
          setEmployeesUpdate(true)
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
  const filterProps = (value, filter) => {
    setStatusTitle('All')
    let filteredEmployees = []
    if (filter === 'group') {
      setActivity(null)
      filteredEmployees = allEmployees.filter(
        (employee) => employee.group_id === value
      )
    } else if (filter === 'activity') {
      setGroup(null)
      filteredEmployees = allEmployees.filter(
        (employee) => employee.activity_id === value
      )
    }

    setEmployees(filteredEmployees)
  }

  const filters = [
    {
      label: 'All',
      key: 'all'
    },
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

  const filterState = {
    items: filters,
    onClick: (value) => {
      setActivity(null)
      setGroup(null)
      if (value.key === 'all') {
        setEmployees(allEmployees)
        setStatusTitle('All')
      } else if (value.key === 'deleted') {
        setEmployees(deletedEmployees)
        setStatusTitle('Deleted')
      }
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
      title: 'Employee',
      dataIndex: 'name'
    },
    {
      title: 'Group',
      dataIndex: 'group',
      align: 'center'
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      align: 'center'
    },
    {
      title: 'Join date',
      dataIndex: 'joinDate',
      width: '10%',
      align: 'center',
      sorter: (a, b) => a.joinDate - b.joinDate
    },
    {
      title: 'First in',
      dataIndex: 'firstIn',
      align: 'center'
    },
    {
      title: 'Last out',
      dataIndex: 'lastOut',
      align: 'center'
    },
    {
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      width: '100px'
    }
  ]

  const employeeRows = useMemo(() => {
    return employees?.map((employee, key) => {
      return {
        key,
        id: employee.id,
        name: (
          <div className="flex gap-4 items-center">
            <Avatar letter="D" size="large">
              <p className="text-lg">{employee.name[0]}</p>
            </Avatar>
            <div className="flex flex-col">
              <Text>{employee.name}</Text>
            </div>
          </div>
        ),
        group: (
          <Tag bordered={false} color={employee.group?.color}>
            {employee.group?.name}
          </Tag>
        ),
        activity: employee.activity
          ? (
          <Tag bordered={false} color={employee.activity.color}>
            {employee.activity.code}
          </Tag>
            )
          : (
              'No activity'
            ),
        joinDate: dayjs(employee.join_date)
          .add(1, 'day')
          .format('MMM, DD YYYY'),
        firstIn: employee.first_in
          ? dayjs(employee.first_in).format('HH:mm')
          : 'No hour',
        lastOut: employee.last_aut
          ? dayjs(employee.last_aut).format('HH:mm')
          : 'No hour',
        actions: employee.is_deleted
          ? (
          <Popconfirm
            title={`Restore ${employee.name}`}
            description="Are you sure you want to restore this employee?"
            onConfirm={() => eventHandlers.handleRestoreEmployee(employee)}
            okType="danger"
            placement="topLeft"
            okText="Si"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<MdKeyboardReturn title="Restore employee" />}
              className="text-green-500 flex items-center justify-center"
            />
          </Popconfirm>
            )
          : (
          <div className="flex justify-center">
            <Button
              type="text"
              icon={<MdRemoveRedEye title="View employee" />}
              className="text-blue-500 flex items-center justify-center"
              onClick={() => eventHandlers.handleOpenEmployee(employee)}
              disabled={employee.is_deleted}
            />
            <Button
              type="text"
              icon={<MdEdit title="Edit employee" />}
              className="text-green-500 flex items-center justify-center"
              onClick={() => {
                eventHandlers.handleEditEmployee(employee)
                setAction('edit')
              }}
              disabled={employee.is_deleted}
            />
            <Popconfirm
              title={`Delete ${employee.name}`}
              description="Are you sure to delete this employee?"
              onConfirm={() => eventHandlers.handleDeleteEmployee(employee)}
              okType="danger"
              placement="topLeft"
              okText="Si"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<MdDelete title="Delete employee" />}
                className="text-red-500 flex items-center justify-center"
                disabled={employee.is_deleted}
              />
            </Popconfirm>
          </div>
            )
      }
    })
  }, [employees])

  return (
    <>
      <div className="mb-4 flex gap-4">
        <Card cardTitle="Total Employees" filterItems={null}>
          <div className="grid gap-2">
            <FaUsers className="text-5xl text-blue-500 bg-blue-500/10 p-2.5 rounded-xl" />
            <p className="text-blue-500 text-xl ml-2">{employeesCount}</p>
          </div>
        </Card>

        <Card cardTitle="Total Groups" filterItems={null}>
          <div className="grid gap-2">
            <FaLayerGroup className="text-5xl text-green-500 bg-green-500/10 p-3 rounded-xl" />
            <p className="text-green-500 text-xl ml-2">{groupsCount}</p>
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Button
          className="mb-4"
          onClick={() => {
            eventHandlers.handleOpenModal()
            setAction('add')
          }}
        >
          Add employee
        </Button>
        <div className="flex mb-4 gap-4 justify-end">
          <Search
            text="Search employee"
            options={allEmployees}
            update={setEmployeesUpdate}
            onSearch={eventHandlers.handleSearchChange}
          />
          <Select
            placeholder="Select group"
            value={group}
            options={groups}
            handleSelect={eventHandlers.handleGroupSelect}
          />
          <Select
            placeholder="Select activity"
            value={activity}
            options={activities}
            handleSelect={eventHandlers.handleActivitySelect}
          />
          <Dropdown title={statusTitle} filters={filterState} />
        </div>
      </div>
      <Suspense fallback={<SkeletonTable />}>
        <Table
          columns={columns}
          data={employeeRows}
          locale={{ emptyText: 'No employees' }}
          loading={loading}
        />
      </Suspense>
      <Drawer
        title="View employee"
        placement="right"
        isOpen={openEmployee}
        isClose={eventHandlers.handleCloseEmployee}
      >
        <ViewPage employee={employee} />
      </Drawer>
      <Modal
        title="Add Employee"
        width={500}
        isModalOpen={openModal}
        handleCancel={eventHandlers.handleCloseModal}
        handleSave={eventHandlers.handleSaveEmployee}
        validate={!isEmployeeValidated}
      >
        <FormPage
          action={action}
          employee={employee}
          setEmployee={eventHandlers.handleSetEmployee}
          updateValidation={eventHandlers.handleEmployeeValidation}
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

export default EmployeesPage
