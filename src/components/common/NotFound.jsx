'use client'
import Image from 'next/image'
import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from 'antd'

const App = () => {
  const currentPage = usePathname()
  return (
    <div className="m-auto flex items-center h-screen bg-[#191919] justify-center">
      <div className="flex flex-col justify-center items-center gap-2">
        <h2 className="text-2xl font-extrabold text-ghost-white">
          <div className="flex gap-1 justify-center">
            <span className="text-8xl font-semibold">4</span>
            <Image src="/logo.svg" width={75} height={75} alt="notFound.png" />
            <span className="text-8xl font-semibold">4</span>
          </div>
          <span className="font-semibold flex justify-center text-3xl">
            Not found
          </span>
        </h2>
        <p className="text-ghost-white mt-2">
          Sorry, the page you visited does not exist:{' '}
          <span className="text-tomato font-semibold">{currentPage}</span>
        </p>
      </div>
      <Button
        type="primary"
        className="mt-2"
        onClick={() => window.history.back()}
      />
    </div>
  )
}

export default App
