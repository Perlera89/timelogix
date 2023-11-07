import React from 'react'
import { Avatar } from 'antd'

const App = ({ size, style, children }) => {
  return (
    <Avatar
      className="flex justify-center items-center"
      style={style}
      size={size}
    >
      {children}
    </Avatar>
  )
}
export default App
