import React from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Dropdown, message } from 'antd'

const Setting = ({ title }) => {
  const handleMenuClick = (e) => {
    message.info(`Se dio click en ${e.key}`)
    console.log('click', e)
  }

  const items = [
    { label: 'Opcion 1', key: 'option1' },
    { label: 'Opcion 2', key: 'option2' }
  ]

  const menuProps = {
    items,
    onClick: handleMenuClick
  }

  return (
    <Dropdown.Button
      className="flex justify-center items-center"
      menu={menuProps}
      placement="bottom"
      icon={<UserOutlined />}
    >
      {title}
    </Dropdown.Button>
  )
}

export default Setting
