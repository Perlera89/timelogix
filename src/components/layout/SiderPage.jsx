'use client'
import React, { useState } from 'react'
import { Menu, Layout } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// icons
import { RiTimeFill, RiCalendarFill, RiSuitcase2Fill } from 'react-icons/ri'
import { HiUsers } from 'react-icons/hi'
import { BsTagFill } from 'react-icons/bs'
import { GoFileDirectoryFill } from 'react-icons/go'

const { Sider } = Layout

const SiderPage = ({ collapsed }) => {
  const [selectedKey, setSelectedKey] = useState('timesheet')
  const router = useRouter()
  const getItem = (label, key, icon, children, type) => {
    return {
      key,
      icon,
      children,
      label,
      type,
      onClick: () => setSelectedKey(key)
    }
  }

  const items = [
    getItem(
      <Link href="/pages/timesheet">Timesheet</Link>,
      'timesheet',
      <RiTimeFill />
    ),
    getItem(
      <Link href="/pages/projects">Projects</Link>,
      'projects',
      <GoFileDirectoryFill />
    ),
    getItem(
      <Link href="/pages/activities">Activities</Link>,
      'activities',
      <BsTagFill />
    ),
    getItem(
      <Link href="/pages/timeoffs">Time Offs</Link>,
      'timeoff',
      <RiSuitcase2Fill />
    ),
    getItem(
      <Link href="/pages/holidays">Holidays</Link>,
      'holidays',
      <RiCalendarFill />
    ),
    getItem(
      <Link href="/pages/employees">Employees</Link>,
      'employees',
      <HiUsers />
    )
  ]

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="border-r-[1px] border-border-black"
    >
      <div className="w-full bg-jet py-4 px-2">
        <Image
          className="m-auto cursor-pointer"
          src="/logo.svg"
          alt="dynamite"
          width={100}
          height={100}
          onClick={() => {
            setSelectedKey('timesheet')
            router.push('/pages/timesheet')
          }}
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['home']}
        selectedKeys={[selectedKey]}
        className="bg-rich-black"
        items={items}
      />
    </Sider>
  )
}

export default SiderPage
