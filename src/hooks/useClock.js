// useClock.js
import { useState, useEffect } from 'react'

const useClock = (initialStartClock = false) => {
  const [startClock, setStartClock] = useState(initialStartClock)
  const [time, setTime] = useState('00:00:00')

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

  return { startClock, setStartClock, time }
}

export default useClock
