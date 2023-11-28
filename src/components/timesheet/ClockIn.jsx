'use client'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

// componets
import Select from '../entry/Select'
import Textarea from '@/components/entry/Textarea'
// import Avatar from '@/components/common/Avatar'
import Result from '@/components/common/Result'
import Badge from '@/components/common/Badge'

// icons
import { GoFileDirectoryFill } from 'react-icons/go'
import { BsTagFill } from 'react-icons/bs'
import { RiTimeFill, RiCalendarFill } from 'react-icons/ri'

import { EMPLOYEES_ROUTE, ACTIVITIES_ROUTE } from '@/utils/apiRoutes'
import { Typography } from 'antd'

const { Text } = Typography

const ClockIn = ({ setClockin, updateValidation }) => {
  // states
  const [currentTime, setCurrentTime] = useState(dayjs())
  const [allEmployees, setAllEmployees] = useState([])
  const [employees, setEmployees] = useState([])
  const [employee, setEmployee] = useState(null)
  const [activities, setActivities] = useState([])
  const [activity, setActivity] = useState(null)
  const [note, setNote] = useState(null)
  const [project, setProject] = useState(null)
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)

  const fetchEmployees = async () => {
    await axios
      .get(EMPLOYEES_ROUTE)
      .then((response) => {
        const employeesData = response.data.filter(
          (employee) => employee.is_deleted === false
        )

        setAllEmployees(employeesData)

        setEmployees(
          employeesData.map((employee) => ({
            value: employee.id,
            label: employee.name
          }))
        )
      })
      .catch((error) => {
        setError(error)
        eventHandlers.handleOpenResult()
      })
  }

  const fetchActivities = async () => {
    await axios
      .get(ACTIVITIES_ROUTE)
      .then((response) => {
        const activitiesData = response.data.filter(
          (activity) => activity.is_deleted === false
        )

        setActivities(activitiesData)
      })
      .catch((error) => {
        setError(error)
        eventHandlers.handleOpenResult()
      })
  }

  const eventHandlers = {
    handleEmployeeSelect: async (value) => {
      setEmployee(value)
      setClockin((prevData) => ({
        ...prevData,
        employee_id: value
      }))

      eventHandlers.handleActivitySelect(value)
    },
    handleActivitySelect: (value) => {
      const employeeSelect = allEmployees.find(
        (employee) => employee.id === value
      )

      const activitySelect = activities.find(
        (activity) => activity.id === employeeSelect.activity_id
      )
      setActivity(activitySelect?.name)
      setProject(activitySelect?.project?.name)
    },
    handleOpenResult: () => {
      setOpenResult(true)
    },
    handleCloseResult: () => {
      setOpenResult(false)
    },
    handleNoteChange: (event) => {
      setNote(event.target.value)
      setClockin((prevData) => ({
        ...prevData,
        note: event.target.value
      }))
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchEmployees()
      await fetchActivities()
    }
    resetForm()
    fetchData()
  }, [])

  useEffect(() => {
    const updateCurrentTime = () => {
      const currentDate = dayjs().format('YYYY-MM-DDTHH:mm:ssZ')
      const currentTime = dayjs().toISOString()
      setClockin((prevData) => ({
        ...prevData,
        date: currentDate,
        start_time: currentTime
      }))

      setCurrentTime(dayjs())
      const secondsUntilNextMinute = 60 - dayjs().second()
      setTimeout(updateCurrentTime, secondsUntilNextMinute * 1000)
    }

    updateCurrentTime()

    return () => clearTimeout(updateCurrentTime)
  }, [])

  // validations
  const validations = {
    employee: (value) => !!value,
    activity: (value) => !!value
  }

  const [validation, setValidation] = useState({
    employee: false,
    activity: false
  })

  // Actualizar el estado de validación
  useEffect(() => {
    setValidation({
      employee: validations.employee(employee),
      activity: validations.activity(activity)
    })
  }, [employee, activity])

  // Verificar los campos
  useEffect(() => {
    const areAllFieldsValid = Object.values(validation).every(Boolean)
    updateValidation(areAllFieldsValid)
  }, [validation])

  const resetForm = () => {
    setEmployee(null)
    setNote(null)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* <div className="flex gap-4 items-center">
        <Avatar size="large" style={{ width: '64px', height: '64px' }}>
          <p className="text-2xl">D</p>
        </Avatar>
        <div className="flex flex-col">
          <Text>Denis Lopez</Text>
          <Text className="text-sm" type="secondary">
            Tester
          </Text>
          <Text className="text-sm" type="secondary">
            Las out 11 minutes ago
          </Text>
        </div>
      </div>
      <Divider className="m-2" /> */}
      <Badge title="Select employee is required" validate={validation.employee}>
        <Badge
          title="Employee has no activity"
          validate={validation.employee && validation.activity}
        >
          <Select
            placeholder="Select employee"
            value={employee}
            options={employees}
            handleSelect={eventHandlers.handleEmployeeSelect}
          />
        </Badge>
      </Badge>
      {[
        [RiTimeFill, currentTime.format('HH:mm')],
        [RiCalendarFill, 'Today'],
        [GoFileDirectoryFill, project || 'No project'],
        [BsTagFill, activity || 'No activity']
      ].map(([Icon, value], key) => (
        <div key={key} className="flex items-center gap-4 my-2">
          <Icon />
          <Text>{value}</Text>
        </div>
      ))}
      <Textarea
        placeholder="Note"
        value={note}
        handleChange={eventHandlers.handleNoteChange}
      />
      <Result
        title={error ? error?.request?.statusText : null}
        subtitle={error ? error?.message : null}
        error={error ? error?.stack : null}
        open={openResult}
        handleClose={eventHandlers.handleCloseResult}
      />
    </div>
  )
}

export default ClockIn
