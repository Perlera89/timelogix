'use client'
import { Suspense, useEffect, useState } from 'react'
import {
  Button,
  Tag,
  Popconfirm,
  Typography,
  message,
  DatePicker,
  Skeleton
} from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'

// components
import Table from '@/components/common/Table'
import Search from '@/components/entry/Search'
import Dropdown from '@/components/common/Dropdown'
import Card from '@/components/common/CardItem'
import Avatar from '@/components/common/Avatar'
import Modal from '@/components/Modal'
import Drawer from '@/components/common/DrawerItem'
import Result from '@/components/common/Result'

import FormPage from './admin/Form'
import ViewPage from './admin/View'

// icons
import { FaUsers } from 'react-icons/fa'
import { PiArrowsClockwise } from 'react-icons/pi'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import {
  MdRemoveRedEye,
  MdCheck,
  MdClose,
  MdEdit,
  MdDelete,
  MdKeyboardReturn
} from 'react-icons/md'

import { TIMEOFFS_ROUTE, TYPE_TIMEOFFS_ROUTE } from '@/utils/apiRoutes'

const { Text } = Typography

const TimeOffsPage = () => {
  const timeoffAction = {
    add: 'add',
    edit: 'edit'
  }

  // states
  const [timeoff, setTimeOff] = useState({})
  const [allTimeOffs, setAllTimeOffs] = useState([])
  const [timeoffs, setTimeOffs] = useState([])
  const [timeoffsCount, setTimeOffsCount] = useState(0)
  const [successCount, setSuccessCount] = useState(0)
  const [processCount, setProcessCount] = useState(0)
  const [rejectCount, setRejectCount] = useState(0)
  const [timeoffsUpdate, setTimeOffsUpdate] = useState(false)
  const [deletedTimeOffs, setDeletedTimeOffs] = useState([])
  const [types, setTypes] = useState([])
  const [openTimeOff, setOpenTimeOff] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedTypeName, setSelectedTypeName] = useState('All')
  const [action, setAction] = useState(timeoffAction.add)
  const [isTimeOffValidated, setIsTimeOffValidated] = useState(false)
  const [clearModal, setClearModal] = useState(false)
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)
  const [dateFilterName, setDateFilterName] = useState('Today')
  const [dateFilter, setDateFilter] = useState('today')
  const [date, setDate] = useState(null)
  const [color, setColor] = useState(null)
  const [icon, setIcon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()

  // fetch data
  // -- timeoff
  const fetchTimeOffs = async () => {
    setTimeOffsUpdate(false)
    await axios
      .get(TIMEOFFS_ROUTE)
      .then((response) => {
        const timeoffsData = response.data.filter(
          (timeoff) => timeoff.is_deleted === false
        )
        setTimeOffs(timeoffsData)
        setTimeOffsCount(timeoffsData.length)

        setDeletedTimeOffs(
          response.data.filter((timeoff) => timeoff.is_deleted)
        )

        setLoading(false)
        setAllTimeOffs(timeoffsData)
      })
      .catch((error) => {
        eventHandlers.handleOpenResult()
        setError(error)
      })
  }

  // -- types
  const fetchTypes = async () => {
    await axios
      .get(TYPE_TIMEOFFS_ROUTE)
      .then((response) => {
        setTypes(response.data)
      })
      .catch((error) => {
        eventHandlers.handleOpenResult()
        setError(error)
      })
  }

  //! effects

  useEffect(() => {
    fetchTimeOffs()
    fetchTypes()

    setSelectedTypeName('All')

    if (selectedType === 'all') {
      setTimeOffs(allTimeOffs)
    } else {
      setTimeOffs(
        timeoffs.filter((timeoff) => timeoff.type.id === selectedType)
      )
    }
    filterTimeOffsByDate(dateFilter)
  }, [timeoffsUpdate])

  useEffect(() => {
    const successCount = allTimeOffs.filter(
      (timeoff) => timeoff.status === 'approved'
    ).length
    const processCount = allTimeOffs.filter(
      (timeoff) => timeoff.status === 'pending'
    ).length
    const rejectCount = allTimeOffs.filter(
      (timeoff) => timeoff.status === 'rejected'
    ).length

    setSuccessCount(successCount)
    setProcessCount(processCount)
    setRejectCount(rejectCount)
  }, [timeoffs])

  const handleFilterCard = (value) => {
    const filterMap = {
      all: () => true,
      success: (timeoff) => timeoff.status === 'approved',
      processing: (timeoff) => timeoff.status === 'pending',
      reject: (timeoff) => timeoff.status === 'rejected'
    }

    const filterFunction = filterMap[value] || (() => false)

    const filteredTimeOffs = allTimeOffs.filter(filterFunction)
    setTimeOffs(filteredTimeOffs)
  }

  //! handlers
  const eventHandlers = {
    handleOpenTimeOff: (timeoff, color, icon) => {
      console.log('timeoff', timeoff)
      setTimeOff(timeoff)
      setColor(color)
      setIcon(icon)
      setOpenTimeOff(true)
    },
    handleCloseTimeOff: () => {
      setOpenTimeOff(false)
    },
    handleOpenResult: () => {
      setOpenResult(true)
    },
    handleCloseResult: () => {
      setOpenResult(false)
    },
    handleEditTimeOff: (timeoff) => {
      setTimeOff(timeoff)
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
      setTimeOffs(value)
    },
    handleTimeOffValidation: (isValidated) => {
      setIsTimeOffValidated(isValidated)
    },
    handleSaveTimeOff: async () => {
      try {
        if (action === timeoffAction.add) {
          await axios.post(TIMEOFFS_ROUTE, timeoff)
          setTimeOffsUpdate(true)
          messages.addSuccess(timeoff.name)
          eventHandlers.handleCloseModal()
        } else {
          console.log('para actu', timeoff)
          const response = await axios.put(
            `${TIMEOFFS_ROUTE}/${timeoff.id}`,
            timeoff
          )
          const updatedTimeOff = response.data
          setTimeOffsUpdate(true)
          messages.editSuccess(updatedTimeOff.name)
          eventHandlers.handleCloseModal()
        }
      } catch (error) {
        eventHandlers.handleOpenResult()
        setError(error)
      }
    },
    handleDeleteTimeOff: async (timeoff) => {
      try {
        const id = timeoff.id
        await axios.put(`${TIMEOFFS_ROUTE}/${id}/delete`)
        setTimeOffsUpdate(true)
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
    handleRestoreTimeOff: async (timeoff) => {
      try {
        const id = timeoff.id
        const name = timeoff.name
        await axios.put(`${TIMEOFFS_ROUTE}/${id}/restore`)
        setTimeOffsUpdate(true)
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
      setSelectedType(value)
      filterTimeOffs(value)
    },
    handleDateFilterChange: (value) => {
      setDateFilter(value)
      filterTimeOffsByDate(value)
    },
    handleDateChange: (value) => {
      setDate(value)
      handleDateFilterChange(value)
    },
    handleStatusChange: async (timeoff, status) => {
      timeoff.status = status
      await axios
        .put(`${TIMEOFFS_ROUTE}/${timeoff.id}`, timeoff)
        .then((res) => {
          setTimeOffsUpdate(true)
          console.log('res', res)
        })
        .catch((err) => {
          console.log('err', err)
        })
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
        content: 'Deleted successfully',
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

  const dateFilters = [
    { label: 'Today', key: 'today' },
    { label: 'Yesterday', key: 'yesterday' },
    { label: 'Last 7 days', key: 'last7days' },
    { label: 'Last month', key: 'lastMonth' },
    { label: 'This year', key: 'thisYear' }
  ]

  const statusMappings = {
    approved: {
      color: 'green',
      icon: <CheckCircleOutlined />
    },
    pending: {
      color: 'blue',
      icon: <SyncOutlined />
    },
    rejected: {
      color: 'red',
      icon: <CloseCircleOutlined />
    }
  }

  const filterTimeOffsByDate = (dateFilter) => {
    const today = dayjs().startOf('day')

    const dateFilters = {
      today: (timeoff) =>
        dayjs(timeoff.start_date).startOf('day').isSame(today, 'day'),
      yesterday: (timeoff) =>
        dayjs(timeoff.start_date)
          .startOf('day')
          .isSame(today.subtract(1, 'day'), 'day'),
      last7days: (timeoff) =>
        dayjs(timeoff.start_date).isAfter(today.subtract(7, 'day')),
      lastMonth: (timeoff) =>
        dayjs(timeoff.start_date)
          .startOf('day')
          .isSame(today.subtract(1, 'month'), 'month'),
      thisYear: (timeoff) =>
        dayjs(timeoff.start_date).startOf('day').isSame(today, 'year')
    }

    const dateFilterNames = {
      today: 'Today',
      yesterday: 'Yesterday',
      last7days: 'Last 7 days',
      lastMonth: 'Last month',
      thisYear: 'This year'
    }

    let filteredTimeOffs = timeoffs
    if (dateFilters[dateFilter]) {
      filteredTimeOffs = allTimeOffs.filter(dateFilters[dateFilter])
    }

    setTimeOffs(filteredTimeOffs)
    setDateFilterName(dateFilterNames[dateFilter])
  }

  const handleDateFilterChange = (selectedDay) => {
    // const day = dayjs(selectedDay.format('YYYY-MM-DDTHH:mm:ssZ'))
    console.log('day', selectedDay.format('YYYY-MM-DDTHH:mm:ssZ'))
    const timeoffsFiltered = allTimeOffs.filter((timeoff) =>
      dayjs(timeoff.start_date).isSame(selectedDay, 'day')
    )

    setTimeOffs(timeoffsFiltered)
  }

  const filterTimeOffs = (key) => {
    if (key === 'all') {
      setTimeOffsUpdate(true)
      setSelectedTypeName('All')
      setTimeOffs(allTimeOffs)
    } else if (key === 'deleted') {
      setTimeOffs(deletedTimeOffs)
      setSelectedTypeName('Deleted')
    } else {
      console.log('timeoffs', timeoffs)
      const filter = allTimeOffs.filter(
        (timeoff) => timeoff.type_id === Number(key)
      )
      console.log('filter', filter)
      setTimeOffs(filter)
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

  const dateFiltersProps = {
    items: dateFilters,
    onClick: (value) => {
      eventHandlers.handleDateFilterChange(value.key)
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
      title: 'Type',
      dataIndex: 'type',
      align: 'center'
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      width: '10%',
      align: 'center',
      sorter: (a, b) => a.joinDate - b.joinDate
    },
    {
      title: 'End date',
      dataIndex: 'endDate',
      align: 'center'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center'
    },
    {
      dataIndex: 'acceptReject',
      align: 'center',
      fixed: 'right',
      width: '100px'
    },
    {
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      width: '100px'
    }
  ]

  const timeoffRows = timeoffs?.map((timeoff, key) => {
    const status = timeoff.status
    const statusMapping = statusMappings[status]
    return {
      key,
      id: timeoff.id,
      name: (
        <div className="flex gap-4 items-center">
          <Avatar letter="D" size="large">
            <p className="text-lg">{timeoff.employee.name[0]}</p>
          </Avatar>
          <div className="flex flex-col">
            <Text>{timeoff.employee.name}</Text>
          </div>
        </div>
      ),
      type: (
        <Tag bordered={false} color={timeoff.type.color}>
          {timeoff.type.name}
        </Tag>
      ),
      startDate: dayjs(timeoff.start_date).format('MMM, DD YYYY'),
      endDate: timeoff.end_date
        ? dayjs(timeoff.end_date).format('MMM, DD YYYY')
        : 'No date',
      status: (
        <Tag
          bordered={false}
          color={statusMapping.color}
          icon={statusMapping.icon}
        >
          {timeoff.status}
        </Tag>
      ),
      acceptReject: timeoff.status === 'pending' && (
        <div className="flex">
          <Popconfirm
            title="Approve Time off request"
            description={`Are you sure you want to approve ${timeoff.employee.name}'s rquest?`}
            onConfirm={() =>
              eventHandlers.handleStatusChange(timeoff, 'approved')
            }
            okType="primary"
            placement="topLeft"
            okText="Si"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<CheckCircleOutlined title="Acept timeoff" />}
              className="text-green-500 flex items-center justify-center"
              disabled={timeoff.is_deleted}
            />
          </Popconfirm>
          <Popconfirm
            title="Reject Time off request"
            description={`Are you sure you want to reject ${timeoff.employee.name}'s rquest?`}
            onConfirm={() =>
              eventHandlers.handleStatusChange(timeoff, 'rejected ')
            }
            okType="primary"
            placement="topLeft"
            okText="Si"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<CloseCircleOutlined title="Reject timeoff" />}
              className="text-red-500 flex items-center justify-center"
              disabled={timeoff.is_deleted}
            />
          </Popconfirm>
        </div>
      ),
      actions: timeoff.is_deleted
        ? (
        <Popconfirm
          title={`Restore timeoff to ${timeoff.employee.name}`}
          description="Are you sure you want to restore this timeoff?"
          onConfirm={() => eventHandlers.handleRestoreTimeOff(timeoff)}
          okType="danger"
          placement="topLeft"
          okText="Si"
          cancelText="No"
        >
          <Button
            type="text"
            icon={<MdKeyboardReturn title="Restore timeoff" />}
            className="text-green-500 flex items-center justify-center"
          />
        </Popconfirm>
          )
        : (
        <div className="flex justify-center">
          <Button
            type="text"
            icon={<MdRemoveRedEye title="View timeoff" />}
            className="text-blue-500 flex items-center justify-center"
            onClick={() =>
              eventHandlers.handleOpenTimeOff(
                timeoff,
                statusMapping.color,
                statusMapping.icon
              )
            }
            disabled={timeoff.is_deleted}
          />
          <Button
            type="text"
            icon={<MdEdit title="Edit timeoff" />}
            className="text-green-500 flex items-center justify-center"
            onClick={() => {
              eventHandlers.handleEditTimeOff(timeoff)
              setAction(timeoffAction.edit)
            }}
            disabled={timeoff.is_deleted}
          />
          <Popconfirm
            title={`Delete timeoff to ${timeoff.employee.name}`}
            description="Are you sure to delete this timeoff?"
            onConfirm={() => eventHandlers.handleDeleteTimeOff(timeoff)}
            okType="danger"
            placement="topLeft"
            okText="Si"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<MdDelete title="Delete timeoff" />}
              className="text-red-500 flex items-center justify-center"
              disabled={timeoff.is_deleted}
            />
          </Popconfirm>
        </div>
          )
    }
  })

  return (
    <>
      <div className="mb-4 flex gap-4">
        <Card
          cardTitle="Total timeoffs"
          filterItems={() => handleFilterCard('all')}
        >
          <div className="grid gap-2">
            <FaUsers className="text-5xl text-blue-500 bg-blue-500/10 p-2.5 rounded-xl" />
            <p className="text-blue-500 text-xl ml-2">{timeoffsCount}</p>
          </div>
        </Card>

        <Card
          cardTitle="Total approved"
          filterItems={() => handleFilterCard('success')}
        >
          <div className="grid gap-2">
            <MdCheck className="text-5xl text-green-500 bg-green-500/10 p-3 rounded-xl" />
            <p className="text-green-500 text-xl ml-2">{successCount}</p>
          </div>
        </Card>

        <Card
          cardTitle="Total pending"
          filterItems={() => handleFilterCard('processing')}
        >
          <div className="grid gap-2">
            <PiArrowsClockwise className="text-5xl text-blue-500 bg-blue-500/10 p-2.5 rounded-xl" />
            <p className="text-blue-500 text-xl ml-2">{processCount}</p>
          </div>
        </Card>

        <Card
          cardTitle="Total rejected"
          filterItems={() => handleFilterCard('reject')}
        >
          <div className="grid gap-2">
            <MdClose className="text-5xl text-red-500 bg-red-500/10 p-2.5 rounded-xl" />
            <p className="text-red-500 text-xl ml-2">{rejectCount}</p>
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button
          className="mb-4"
          onClick={() => {
            eventHandlers.handleOpenModal()
            setAction(timeoffAction.add)
          }}
        >
          Add timeoff
        </Button>
        <div className="mb-4 flex justify-end">
          <Search
            text="Search timeoff"
            options={allTimeOffs}
            update={setTimeOffsUpdate}
            onSearch={eventHandlers.handleSearchChange}
          />
          <div className="flex justify-end gap-2">
            <DatePicker
              value={date}
              onChange={eventHandlers.handleDateChange}
              inputReadOnly
            />
            <Dropdown title={dateFilterName} filters={dateFiltersProps} />
            <Dropdown title={selectedTypeName} filters={filterProps} />
          </div>
        </div>
      </div>
      <Suspense fallback={<Skeleton />}>
        <Table
          columns={columns}
          data={timeoffRows || []}
          locale={{ emptyText: 'No timeoffs' }}
          loading={loading}
        />
      </Suspense>
      <Drawer
        title="View timeoff"
        placement="right"
        isOpen={openTimeOff}
        isClose={eventHandlers.handleCloseTimeOff}
      >
        <ViewPage timeoff={timeoff} color={color} icon={icon} />
      </Drawer>
      <Modal
        title="Add Timeoff"
        width={500}
        isModalOpen={openModal}
        handleCancel={eventHandlers.handleCloseModal}
        handleSave={eventHandlers.handleSaveTimeOff}
        validate={!isTimeOffValidated}
      >
        <FormPage
          action={action}
          timeoff={timeoff}
          setTimeoff={setTimeOff}
          updateValidation={eventHandlers.handleTimeOffValidation}
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

export default TimeOffsPage
