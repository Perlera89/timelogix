import { usePathname } from 'next/navigation'
import dayjs from 'dayjs'
import axios from 'axios'
import HeaderPage from './HeaderPage'
import { UserContext } from '@/utils/userContext'

// components
import React, { useState, useContext } from 'react'
import useClock from '@/hooks/useClock'
import { CLOCKINS_ROUTE } from '@/utils/apiRoutes'

const HeaderClient = ({ handleCollapsed, collapsed }) => {
  // useStates
  const [clockin, setClockin] = useState({})
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClockinValidated, setIsClockinValidated] = useState(false)

  const { startClock, setStartClock, time } = useClock()
  const { user, setUser } = useContext(UserContext)

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

  return (
    <HeaderPage
      path={path}
      time={time}
      startClock={startClock}
      setClockin={setClockin}
      clockin={clockin}
      error={error}
      openResult={openResult}
      isModalOpen={isModalOpen}
      isClockinValidated={isClockinValidated}
      eventHandlers={eventHandlers}
      user={user}
      handleCollapsed={handleCollapsed}
      collapsed={collapsed}
    />
  )
}

export default HeaderClient
