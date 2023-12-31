import React from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'

const App = ({ title, filters }) => (
  <Dropdown
    className="hover:bg-white/10 text-ghost-white flex justify-center items-center px-2 rounded-lg cursor-pointer transition-colors"
    menu={filters}
  >
    <div className="flex gap-4 items-center">
      <p>{title}</p>
      <DownOutlined className='text-white/20' />
    </div>
  </Dropdown>
)
export default App
