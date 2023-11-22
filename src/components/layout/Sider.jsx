'use client'
import React, { useState } from 'react'
import { Menu, Layout } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// icons
import {
  RiTimeFill,
  RiPagesFill,
  RiCalendarFill,
  RiSuitcase2Fill
} from 'react-icons/ri'
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
      <Link href="/timesheet">Timesheet</Link>,
      'timesheet',
      <RiTimeFill />
    ),
    getItem(
      <Link href="/projects">Projects</Link>,
      'projects',
      <GoFileDirectoryFill />
    ),
    getItem(
      <Link href="/activities">Activities</Link>,
      'activities',
      <BsTagFill />
    ),
    getItem(
      <Link href="/timeoffs">Time Offs</Link>,
      'timeoff',
      <RiSuitcase2Fill />
    ),
    getItem(
      <Link href="/holidays">Holidays</Link>,
      'holidays',
      <RiCalendarFill />
    ),
    getItem(<Link href="/employees">Employees</Link>, 'employees', <HiUsers />),
    getItem(<Link href="/reports">Reports</Link>, 'reports', <RiPagesFill />)
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
            router.push('/')
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
