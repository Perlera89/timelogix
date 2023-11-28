'use client'
import { Button, Tag, Popconfirm, Typography, message } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState, Suspense } from 'react'

// components
import Table from '@/components/common/Table'
import Search from '@/components/entry/Search'
import Select from '@/components/entry/Select'
import RadioButton from '@/components/entry/RadioButton'
import Card from '@/components/common/CardItem'
import Modal from '@/components/Modal'
import Drawer from '@/components/common/DrawerItem'
import Result from '@/components/common/Result'
import SkeletonTable from '@/components/skeleton/SkeletonTable'

import ViewPage from './View'
import FormPage from './Form'

// icon
import { FaTag } from 'react-icons/fa'
import { BsCalendarDateFill } from 'react-icons/bs'
import {
  MdRemoveRedEye,
  MdEdit,
  MdDelete,
  MdKeyboardReturn
} from 'react-icons/md'

import { HOLIDAYS_ROUTE, TYPE_HOLIDAYS_ROUTE } from '@/utils/apiRoutes'

const { Text } = Typography

const HolidaysPage = () => {
  const holidayAction = {
    add: 'add',
    edit: 'edit'
  }

  // states
  const [holiday, setHoliday] = useState({})
  const [year, setYear] = useState('2023')
  const [allHolidays, setAllHolidays] = useState([])
  const [holidays, setHolidays] = useState([])
  const [holidaysCount, setHolidaysCount] = useState(0)
  const [holidaysUpdate, setHolidaysUpdate] = useState(false)
  const [deletedHolidays, setDeletedHolidays] = useState([])
  const [typeHolidays, setTypeHolidays] = useState([])
  const [type, setType] = useState([])
  const [typeHolidaysCount, setTypeHolidaysCount] = useState(0)
  const [openHoliday, setOpenHoliday] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [statusValue, setStatusValue] = useState('all')
  const [action, setAction] = useState(holidayAction.add)
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)
  const [isHolidayValidated, setIsHolidayValidated] = useState(false)
  const [clearModal, setClearModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const [messageApi, contextHolder] = message.useMessage()

  // fetch data
  // -- holiday
  const fetcHolidays = async (year) => {
    await axios
      .get(HOLIDAYS_ROUTE)
      .then((response) => {
        const holidaysData = response.data.filter(
          (holiday) =>
            holiday.is_deleted === false &&
            new Date(holiday.start_date).getFullYear() === Number(year)
        )
        setHolidays(holidaysData)
        setHolidaysCount(holidaysData.length)

        const deletedHolidaysData = response.data.filter(
          (holiday) => holiday.is_deleted
        )
        setDeletedHolidays(deletedHolidaysData)

        // Guardar todos los empleados sin filtrar
        setAllHolidays(holidaysData)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        eventHandlers.handleOpenResult()
      })
  }

  // -- type
  const fetchTypeHolidays = async () => {
    await axios
      .get(TYPE_HOLIDAYS_ROUTE)
      .then((response) => {
        setTypeHolidays(
          response.data.map((type) => ({
            label: type.name,
            value: type.id
          }))
        )
        setTypeHolidaysCount(response.data.length)
      })
      .catch((error) => {
        setError(error)
        eventHandlers.handleOpenResult()
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetcHolidays('2023')
      await fetchTypeHolidays()
    }
    fetchData()
    setHolidaysUpdate(false)
  }, [holidaysUpdate])

  // handlers
  const eventHandlers = {
    handleOpenholiday: (holiday) => {
      setHoliday(holiday)
      setOpenHoliday(true)
    },
    handleCloseholiday: () => {
      setOpenHoliday(false)
    },
    handleEditholiday: (holiday) => {
      setHoliday(holiday)
      eventHandlers.handleOpenModal()
    },
    handleOpenModal: () => {
      setOpenModal(true)
    },
    handleCloseModal: () => {
      setClearModal(!clearModal)
      setOpenModal(false)
    },
    handleOpenResult: () => {
      setOpenResult(true)
    },
    handleCloseResult: () => {
      setOpenResult(false)
    },
    handleSearchChange: (value) => {
      setHolidays(value)
    },
    handleDateChange: ({ target: { value } }) => {
      setYear(value)
    },
    handleHolidayValidation: (isValidated) => {
      setIsHolidayValidated(isValidated)
    },
    handleTypeSelect: (value) => {
      setType(value)
      eventHandlers.handleFilterChange(value)
    },
    handleFilterChange: (value) => {
      filterProps(value)
    },
    handleYearChange: async (year) => {
      const yearFilter = holidays.filter(
        (holiday) =>
          new Date(holiday.start_date).getFullYear() === year.target.value
      )

      setYear(year.target.value)
      setHolidays(yearFilter)
      await fetcHolidays(year.target.value)
    },
    handleSaveHoliday: async () => {
      try {
        if (action === holidayAction.add) {
          await axios.post(HOLIDAYS_ROUTE, holiday)
          setHolidaysUpdate(true)
          messages.addSuccess(holiday.name)
          eventHandlers.handleCloseModal()
        } else {
          const response = await axios.put(
            `${HOLIDAYS_ROUTE}/${holiday.id}`,
            holiday
          )
          const updatedholiday = response.data
          setHolidaysUpdate(true)
          messages.editSuccess(updatedholiday.name)
          eventHandlers.handleCloseModal()
        }
      } catch (error) {
        eventHandlers.handleOpenResult()
        setError(error)
      }
    },
    handleDeleteHoliday: async (holiday) => {
      const id = holiday.id
      await axios
        .put(`${HOLIDAYS_ROUTE}/${id}/delete`)
        .then((response) => {
          setHolidaysUpdate(true)
          messages.deletedSuccess()
        })
        .catch((error) => {
          eventHandlers.handleOpenResult()
          setError(error)
        })
    },
    handleRestoreHoliday: async (holiday) => {
      const id = holiday.id
      await axios
        .put(`${HOLIDAYS_ROUTE}/${id}/restore`)
        .then((response) => {
          setHolidaysUpdate(true)
          messages.restoredSuccess()
        })
        .catch((error) => {
          eventHandlers.handleOpenResult()
          setError(error)
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
  const filterProps = (value) => {
    setStatusValue('All')
    const filteredHolidays = allHolidays.filter(
      (holiday) => holiday.type.id === value
    )

    setHolidays(filteredHolidays)
  }

  const yearOptions = [
    {
      label: '2022',
      value: '2022'
    },
    {
      label: '2023',
      value: '2023'
    },
    {
      label: '2024',
      value: '2024'
    }
  ]

  const columns = [
    {
      title: '',
      dataIndex: 'id',
      width: '50px',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Holiday',
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
      align: 'center',
      sorter: (a, b) => a.joinDate - b.joinDate
    },
    {
      title: 'End date',
      dataIndex: 'endDate',
      align: 'center'
    },
    {
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      width: '100px'
    }
  ]

  const holidayRows = useMemo(() => {
    return holidays?.map((holiday, key) => {
      return {
        key,
        id: holiday.id,
        name: <Text>{holiday.name}</Text>,
        type: (
          <Tag bordered={false} color={holiday.type.color}>
            {holiday.type.name}
          </Tag>
        ),
        startDate: dayjs(holiday.start_date).format('MMM, DD YYYY'),
        endDate: holiday.end_date
          ? dayjs(holiday.end_date).format('MMM, DD YYYY')
          : 'No date',
        actions: holiday.is_deleted
          ? (
          <Popconfirm
            title={`Restore ${holiday.name}`}
            description="Are you sure you want to restore this holiday?"
            onConfirm={() => eventHandlers.handleRestoreHoliday(holiday)}
            okType="danger"
            placement="topLeft"
            okText="Si"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<MdKeyboardReturn title="Restore holiday" />}
              className="text-green-500 flex items-center justify-center"
            />
          </Popconfirm>
            )
          : (
          <div className="flex justify-center">
            <Button
              type="text"
              icon={<MdRemoveRedEye title="View holiday" />}
              className="text-blue-500 flex items-center justify-center"
              onClick={() => eventHandlers.handleOpenholiday(holiday)}
              disabled={holiday.is_deleted}
            />
            <Button
              type="text"
              icon={<MdEdit title="Edit holiday" />}
              className="text-green-500 flex items-center justify-center"
              onClick={() => {
                eventHandlers.handleEditholiday(holiday)
                setAction(holidayAction.edit)
              }}
              disabled={holiday.is_deleted}
            />
            <Popconfirm
              title={`Delete ${holiday.name}`}
              description="Are you sure to delete this holiday?"
              onConfirm={() => eventHandlers.handleDeleteHoliday(holiday)}
              okType="danger"
              placement="topLeft"
              okText="Si"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<MdDelete title="Delete holiday" />}
                className="text-red-500 flex items-center justify-center"
                disabled={holiday.is_deleted}
              />
            </Popconfirm>
          </div>
            )
      }
    })
  }, [holidays])

  return (
    <>
      <div className="mb-4 flex gap-4">
        <Card cardTitle="Total holidays" filterItems={null}>
          <div className="grid gap-2">
            <BsCalendarDateFill className="text-5xl text-blue-500 bg-blue-500/10 p-2.5 rounded-xl" />
            <p className="text-blue-500 text-xl ml-2">{holidaysCount}</p>
          </div>
        </Card>

        <Card cardTitle="Total type holidays" filterItems={null}>
          <div className="grid gap-2">
            <FaTag className="text-5xl text-green-500 bg-green-500/10 p-3 rounded-xl" />
            <p className="text-green-500 text-xl ml-2">{typeHolidaysCount}</p>
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button
          className="mb-4"
          onClick={() => {
            eventHandlers.handleOpenModal()
            setAction(holidayAction.add)
          }}
        >
          Add holiday
        </Button>
        <div className="flex mb-4 gap-4 justify-end">
          <Search
            text="Search holiday"
            update={setHolidaysUpdate}
            options={allHolidays}
            onSearch={eventHandlers.handleSearchChange}
          />
          <RadioButton
            value={year}
            options={yearOptions}
            handleChange={eventHandlers.handleYearChange}
          />
          <Select
            bordered={false}
            placeholder="Select group"
            value={type}
            options={typeHolidays}
            handleSelect={eventHandlers.handleTypeSelect}
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
                setHolidays(allHolidays)
              } else {
                setHolidays(deletedHolidays)
              }
            }}
          />
        </div>
      </div>
      <Suspense fallback={<SkeletonTable />}>
        <Table
          columns={columns}
          data={holidayRows}
          locale={{ emptyText: 'No holidays' }}
          loading={loading}
        />
      </Suspense>
      <Drawer
        title="View holiday"
        placement="right"
        isOpen={openHoliday}
        isClose={eventHandlers.handleCloseholiday}
      >
        <ViewPage holiday={holiday} />
      </Drawer>
      <Modal
        title="Add holiday"
        width={500}
        isModalOpen={openModal}
        handleCancel={eventHandlers.handleCloseModal}
        handleSave={eventHandlers.handleSaveHoliday}
        validate={!isHolidayValidated}
      >
        <FormPage
          action={action}
          holiday={holiday}
          setHoliday={setHoliday}
          updateValidation={eventHandlers.handleHolidayValidation}
          handleCancel={clearModal}
        />
      </Modal>
      <Result
        title={error ? error?.request?.statusText : null}
        subtitle={error ? error?.message : null}
        open={openResult}
        handleClose={eventHandlers.handleCloseResult}
      />
      {contextHolder}
    </>
  )
}

export default HolidaysPage
