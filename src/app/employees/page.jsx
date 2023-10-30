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

import AdminEmployee from './admin/Update'
import ViewEmployee from './admin/View'

// icon
import { FaUsers, FaLayerGroup } from 'react-icons/fa'
import {
  MdRemoveRedEye,
  MdEdit,
  MdDelete,
  MdKeyboardReturn
} from 'react-icons/md'

import { EMPLOYEES_ROUTE, GROUPS_ROUTE } from '@/utils/apiRoutes'

const { Text } = Typography

const EmployeesPage = () => {
  const employeeAction = {
    add: 'add',
    edit: 'edit'
  }

  // states
  const [employee, setEmployee] = useState({})
  const [allEmployees, setAllEmployees] = useState([])
  const [employees, setEmployees] = useState([])
  const [employeesCount, setEmployeesCount] = useState(0)
  const [employeesUpdate, setEmployeesUpdate] = useState(false)
  const [deletedEmployees, setDeletedEmployees] = useState([])
  const [groups, setGroups] = useState([])
  const [groupsCount, setGroupsCount] = useState(0)
  const [openEmployee, setOpenEmployee] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedGroupName, setSelectedGroupName] = useState('All')
  const [action, setAction] = useState(employeeAction.add)
  const [isEmployeeValidated, setIsEmployeeValidated] = useState(false)
  const [clearModal, setClearModal] = useState(false)
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  // fetch data
  // -- employee
  const fetchEmployees = async () => {
    console.log('employee', employee)
    setEmployeesUpdate(false)
    await axios
      .get(EMPLOYEES_ROUTE)
      .then((response) => {
        const employeesData = response.data.filter(
          (employee) => employee.is_deleted === false
        )
        setEmployees(employeesData)
        setEmployeesCount(employeesData.length)

        const deletedEmployeesData = response.data.filter(
          (employee) => employee.is_deleted
        )
        console.log('deletedEmployees', deletedEmployeesData)
        setDeletedEmployees(deletedEmployeesData)

        setAllEmployees(employeesData)
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
        setGroups(response.data)
      })
      .catch((error) => {
        eventHandlers.handleOpenResult()
        setError(error)
      })
  }

  useEffect(() => {
    fetchEmployees()
    fetchGroups()
    setSelectedGroupName('All')

    if (selectedGroup === 'all') {
      setEmployees(allEmployees)
    } else {
      setEmployees(
        employees.filter((employee) => employee.group.id === selectedGroup)
      )
    }
  }, [employeesUpdate, employee])

  // handlers
  const eventHandlers = {
    handleEmployeeChange: (data) => {
      setEmployee(data)
    },
    handleOpenEmployee: (employee) => {
      console.log('employee', employee)
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
    handleSaveEmployee: async () => {
      try {
        if (action === employeeAction.add) {
          const response = await axios.post(EMPLOYEES_ROUTE, employee)
          const newEmployee = response.data
          console.log('Employee saved succesfully', newEmployee)
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
      try {
        const id = employee.id
        await axios.put(`${EMPLOYEES_ROUTE}/${id}/delete`)
        setEmployeesUpdate(true)
        messages.deletedSuccess()
      } catch (error) {
        <Result
          title="Deleted Failed"
          subtitle="subtitulo"
          text={error.message}
          error={error}
          status="error"
        />
      }
    },
    handleRestoreEmployee: async (employee) => {
      try {
        const id = employee.id
        const name = employee.name
        await axios.put(`${EMPLOYEES_ROUTE}/${id}/restore`)
        setEmployeesUpdate(true)
        messages.restoredSuccess(name)
      } catch (error) {
        <Result
          title="Restored Failed"
          text={error.mensaje}
          error={error}
          status="error"
        />
      }
    },
    handleFilterChange: (value) => {
      setSelectedGroup(value)
      filterEmployees(value)
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
    ...groups.map((group) => ({
      label: group.name,
      key: group.id
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

  const filterEmployees = (key) => {
    if (key === 'all') {
      setEmployeesUpdate(true)
      setSelectedGroupName('All')
      setEmployees(allEmployees)
    } else if (key === 'deleted') {
      setEmployees(deletedEmployees)
      setSelectedGroupName('Deleted')
    } else {
      const filter = allEmployees.filter(
        (employee) => employee.group_id === Number(key)
      )
      setEmployees(filter)
      const groupFilter = groups.find((group) => group.id === Number(key))
      setSelectedGroupName(groupFilter.name)
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
      title: 'Employee',
      dataIndex: 'name'
    },
    {
      title: 'Group',
      dataIndex: 'group',
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

  const employeeRows = employees?.map((employee, key) => {
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
        <Tag bordered={false} color={employee.group.color}>
          {employee.group.name}
        </Tag>
      ),
      joinDate: dayjs(employee.join_date).format('MMM, DD YYYY'),
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
              setAction(employeeAction.edit)
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

      <div className="flex justify-between">
        <Button
          className="mb-4"
          onClick={() => {
            eventHandlers.handleOpenModal()
            setAction(employeeAction.add)
          }}
        >
          Add employee
        </Button>
        <div className="mb-4 flex justify-end">
          <Search
            text="Search employee"
            options={allEmployees}
            update={setEmployeesUpdate}
            onSearch={eventHandlers.handleSearchChange}
          />
          <div className="flex justify-end">
            <Dropdown
              title={selectedGroupName}
              filters={filterProps}
            ></Dropdown>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        data={employeeRows}
        locale={{ emptyText: 'No employees' }}
      />
      <Drawer
        title="View employee"
        placement="right"
        isOpen={openEmployee}
        isClose={eventHandlers.handleCloseEmployee}
      >
        <ViewEmployee employee={employee} />
      </Drawer>
      <Modal
        title="Add Employee"
        width={500}
        isModalOpen={openModal}
        handleCancel={eventHandlers.handleCloseModal}
        handleSave={eventHandlers.handleSaveEmployee}
        validate={!isEmployeeValidated}
      >
        <AdminEmployee
          action={action}
          employee={employee}
          handleEmployee={eventHandlers.handleEmployeeChange}
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
