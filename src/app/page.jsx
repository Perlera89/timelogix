'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Spin } from 'antd'

const HomePage = () => {
  const router = useRouter()
  const [isLogged, setIsLogged] = useState(false)
  useEffect(() => {
    if (isLogged) router.push('/pages/timesheet')
    else router.push('/auth/login')
  }, [isLogged])

  return (
    <>
      <Spin
        size="large"
        className="flex items-center justify-center h-screen bg-poor-black"
      />
    </>
  )
}

export default HomePage
