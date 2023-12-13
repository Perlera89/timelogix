'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Button, Popconfirm } from 'antd'
import { EMPLOYEES_ROUTE } from '@/utils/apiRoutes'
import dayjs from 'dayjs'
import Table from '@/components/common/Table'
import Avatar from '@/components/common/Avatar'
import Result from '@/components/common/Result'

const { Text } = Typography

const TimesheetPage = () => {
  const [clockins, setClockins] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(EMPLOYEES_ROUTE)
      const employeesData = response.data.filter(
        (employee) => !employee.is_deleted
      )
      setEmployees(employeesData)
      setLoading(false)
    } catch (error) {
      setError(error)
      setOpenResult(false)
    }
  }

  // Función para calcular el tiempo total trabajado
  const calculateWorkTime = (start, end) => {
    const startTime = dayjs(start)
    const endTime = dayjs(end)
    const diffInMinutes = endTime.diff(startTime, 'minute')
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h ${minutes}m`
  }

  // Función para calcular las horas trabajadas por día
  const calculateTotalWorkTime = (clockins, day) => {
    const totalWorkTime = clockins.reduce((total, clockin) => {
      const workTime = calculateWorkTime(clockin.start_time, clockin.end_time)
      const workDay = dayjs(clockin.date)
        .add(1, 'day')
        .format('dddd')
        .toLowerCase()
      if (workDay === day) {
        const [hours, minutes] = workTime.split(' ')
        total += parseInt(hours) * 60 + parseInt(minutes)
      }
      return total
    }, 0)

    const hours = Math.floor(totalWorkTime / 60)
    const minutes = totalWorkTime % 60
    return `${hours}h ${minutes}m`
  }

  const calculateTotalWorkTimeForAllDays = (clockins) => {
    let totalWorkTimeInMinutes = 0;
    [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ].forEach((day) => {
      const workTimeForDay = calculateTotalWorkTime(clockins, day)
      const [hours, minutes] = workTimeForDay.split(' ')
      totalWorkTimeInMinutes += parseInt(hours) * 60 + parseInt(minutes)
    })

    const totalHours = Math.floor(totalWorkTimeInMinutes / 60)
    const totalMinutes = totalWorkTimeInMinutes % 60
    return `${totalHours}h ${totalMinutes}m`
  }

  // const calculateWorkTime = (start, end) => {
  //   const startTime = dayjs(start)
  //   const endTime = dayjs(end)
  //   const diffInMinutes = endTime.diff(startTime, 'minute')
  //   const hours = Math.floor(diffInMinutes / 60)
  //   const minutes = diffInMinutes % 60
  //   const workTime = `${hours}h ${minutes}m`
  //   return workTime
  // }

  useEffect(() => {
    const fetchData = async () => {
      await fetchEmployees()
    }
    fetchData()
  }, [])

  const eventHandlers = {
    handleCloseResult: () => {
      setOpenResult(false)
    }
  }

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee'
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mon',
      dataIndex: 'monday',
      width: '100px'
    },
    {
      title: 'Tue',
      dataIndex: 'tuesday',
      width: '100px'
    },
    {
      title: 'Wed',
      dataIndex: 'wednesday',
      align: 'center',
      width: '100px'
    },
    {
      title: 'Thu',
      dataIndex: 'thursday',
      align: 'center',
      width: '100px'
    },
    {
      title: 'Fri',
      dataIndex: 'friday',
      align: 'center',
      width: '100px'
    },
    {
      title: 'Sat',
      dataIndex: 'saturday',
      align: 'center',
      width: '100px'
    },
    {
      title: 'Sun',
      dataIndex: 'sunday',
      align: 'center',
      width: '100px'
    },
    {
      title: 'Total',
      dataIndex: 'total',
      align: 'center',
      width: '100px'
    },
    {
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      width: '100px'
    }
  ]

  const data = employees.map((employee) => {
    console.log('employee.clockins :>> ', employee.clockins)

    return {
      key: employee.id,
      employee: (
        <div className="flex gap-4 items-center">
          <Avatar letter="D" size="large">
            <p className="text-lg">{employee.name[0]}</p>
          </Avatar>
          <div className="flex flex-col">
            <Text>{employee.name}</Text>
          </div>
        </div>
      ),
      monday: calculateTotalWorkTime(employee.clockins, 'monday'),
      tuesday: calculateTotalWorkTime(employee.clockins, 'tuesday'),
      wednesday: calculateTotalWorkTime(employee.clockins, 'wednesday'),
      thursday: calculateTotalWorkTime(employee.clockins, 'thursday'),
      friday: calculateTotalWorkTime(employee.clockins, 'friday'),
      saturday: calculateTotalWorkTime(employee.clockins, 'saturday'),
      sunday: calculateTotalWorkTime(employee.clockins, 'sunday'),
      total: calculateTotalWorkTimeForAllDays(employee.clockins)
    }
  })
  return (
    <div>
      <Table
        columns={columns}
        data={data}
        loading={loading}
        locale={{ emptyText: 'No timesheet' }}
      />
      <Result
        title={error ? error?.request?.statusText : null}
        subtitle={error ? error?.message : null}
        error={error ? error.stack : null}
        open={openResult}
        handleClose={eventHandlers.handleCloseResult}
      />
    </div>
  )
}

export default TimesheetPage
