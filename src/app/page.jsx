'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

const HomePage = () => {
  const router = useRouter()
  const [isLogged, setIsLogged] = useState(true)
  useEffect(() => {
    if (isLogged) router.push('/timesheet')
  }, [])
  return <div>HomePage</div>
}

export default HomePage
