'use client'
import React, { useState } from 'react'

// components
import { Layout } from 'antd'
import Header from '@/components/layout/HeaderClient'
import Sider from '@/components/layout/SiderPage'

const { Content } = Layout

const App = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  const handleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout className="h-screen flex select-none">
      <Sider collapsed={collapsed} />
      <Layout>
        <Header handleCollapsed={handleCollapsed} collapsed={collapsed} />
        <Content
          className="overflow-y-auto text-white"
          style={{
            padding: 16,
            background: '#141414'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
