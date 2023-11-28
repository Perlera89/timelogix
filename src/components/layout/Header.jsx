'use client'
import { usePathname } from 'next/navigation'
import dayjs from 'dayjs'

// components
import React, { useState, useEffect } from 'react'
import { Layout, Button, Typography } from 'antd'
import Settings from '@/components/Settings'
import IconButton from '@/components/button/IconButton'
import Modal from '@/components/Modal'
import ClockIn from '@/components/timesheet/ClockIn'
import Result from '@/components/common/Result'

// icons
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiPlayFill,
  RiStopFill
} from 'react-icons/ri'
import axios from 'axios'
import { CLOCKINS_ROUTE } from '@/utils/apiRoutes'

const { Header } = Layout
const { Title } = Typography

const HeaderPage = ({ handleCollapsed, collapsed }) => {
  // useStates
  const [clockin, setClockin] = useState({})
  const [startClock, setStartClock] = useState(false)
  const [time, setTime] = useState('00:00:00')
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClockinValidated, setIsClockinValidated] = useState(false)

  const currentPage = usePathname()
  const path =
    currentPage.replace('/', '').charAt(0).toUpperCase() +
    currentPage.replace('/', '').slice(1)

  // handlers
  const eventHandlers = {
    handleOpenModal: () => {
      setIsModalOpen(true)
    },
    handleCloseModal: () => {
      setIsModalOpen(false)
    },
    handleOpenResult: () => {
      setOpenResult(true)
    },
    handleCloseResult: () => {
      setOpenResult(false)
    },
    handleSaveClockin: async () => {
      await axios
        .post(CLOCKINS_ROUTE, clockin)
        .then((response) => {
          setStartClock(true)
          setClockin(response.data)
          console.log('response.data', response.data)
        })
        .catch((error) => {
          setError(error)
          eventHandlers.handleOpenResult()
        })

      eventHandlers.handleCloseModal()
    },
    handleUpdateClockin: async () => {
      console.log('clockin a actualizar', clockin)
      await axios
        .put(`${CLOCKINS_ROUTE}/${clockin.id}`, clockin)
        .then((response) => {
          console.log('clockin actualizado', response.data)
        })
        .catch((error) => {
          setError(error)
          eventHandlers.handleOpenResult()
        })
    },
    handleClock: () => {
      if (startClock) {
        setStartClock(false)
        setClockin((clockin.end_time = dayjs().toISOString()))
        eventHandlers.handleUpdateClockin()
      } else {
        setStartClock(true)
      }
    },
    handleClockinValidation: (isValidated) => {
      setIsClockinValidated(isValidated)
    }
  }

  useEffect(() => {
    let intervalId

    if (startClock) {
      let seconds = 0
      intervalId = setInterval(() => {
        seconds++
        const formattedTime = formatTime(seconds)
        setTime(formattedTime)
      }, 1000)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [startClock])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    const formattedHours = String(hours).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }

  return (
    <>
      <Header
        className="border-b-[1px] border-border-black"
        style={{
          padding: 0,
          background: '#191919'
        }}
      >
        <div className="flex justify-between items-center gap-2">
          <div className="flex justify-start">
            <Button
              type="text"
              className="flex items-center justify-center"
              icon={
                collapsed
                  ? (
                  <RiArrowRightSLine className="text-2xl" title="Show menu" />
                    )
                  : (
                  <RiArrowLeftSLine className="text-2xl" title="Hide menu" />
                    )
              }
              onClick={handleCollapsed}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64
              }}
            />
            <Title
              className="flex items-center text-ghost-white mt-3"
              level={4}
            >
              {path}
            </Title>
          </div>
          <div className="flex justify-end mr-4 gap-4">
            {startClock
              ? (
              <div className="flex items-center justify-center gap-2">
                <p className="">{time}</p>
                <IconButton
                  icon={
                    <RiStopFill
                      className="mx-4 text-red-500 text-2xl transition-colors"
                      title="Stop Clock"
                    />
                  }
                  size="default"
                  click={eventHandlers.handleClock}
                />
              </div>
                )
              : (
              <IconButton
                icon={
                  <RiPlayFill className="mx-2 text-green-500 text-2xl transition-colors animate-pulse transform scale-125 duration-1000 animate-3" />
                }
                size="default"
                click={eventHandlers.handleOpenModal}
              />
                )}
            <Settings title="Denis Lopez" />
          </div>
        </div>
      </Header>
      <Modal
        title="Add Clock in"
        width={400}
        isModalOpen={isModalOpen}
        handleCancel={eventHandlers.handleCloseModal}
        handleSave={eventHandlers.handleSaveClockin}
        validate={!isClockinValidated}
      >
        <ClockIn
          setClockin={setClockin}
          updateValidation={eventHandlers.handleClockinValidation}
        />
      </Modal>
      <Result
        title={error ? error.request.statusText : null}
        subtitle={error ? error.message : null}
        error={error ? error.stack : null}
        open={openResult}
        handleClose={eventHandlers.handleCloseResult}
      />
    </>
  )
}

export default HeaderPage
