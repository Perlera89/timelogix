import React, { useState, useContext } from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Dropdown, message, Modal, Button, Typography, Tag } from 'antd'
import { UserContext } from '@/utils/userContext'
import Avatar from '@/components/common/Avatar'
import { MdEmail, MdVerifiedUser } from 'react-icons/md'

const { Text } = Typography

const Setting = ({ title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user, setUser } = useContext(UserContext)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleMenuClick = (e) => {
    if (e.key === 'profile') {
      return showModal()
    } else if (e.key === 'logout') {
      return message.info('Logout successfully')
    }
  }

  const items = [
    { label: 'Profile', key: 'profile' },
    {
      type: 'divider'
    },
    { label: 'Log out', key: 'logout', danger: true }
  ]

  const menuProps = {
    items,
    onClick: handleMenuClick
  }

  return (
    <>
      <Dropdown.Button
        className="flex justify-center items-center"
        menu={menuProps}
        placement="bottom"
        icon={<UserOutlined />}
      >
        {title}
      </Dropdown.Button>
      <Modal
        centered
        title="Your profile"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button
            type="primary"
            className="bg-tomato"
            key="cancel"
            onClick={handleCancel}
          >
            Close
          </Button>
        ]}
        I
      >
        <>
          <div className="flex gap-4 items-center">
            <Avatar letter="D" size="large">
              <p className="text-lg">{user?.name[0]}</p>
            </Avatar>
            <div className="flex flex-col">
              <Text>{user?.name}</Text>
            </div>
          </div>
          <div className="flex gap-4 my-4 items-center">
            <MdEmail className='text-xl' />
            <Text type="secondary">{user?.email}</Text>
          </div>
          <div className="flex gap-4 my-4 items-center">
            <MdVerifiedUser className='text-xl' />
            <Tag bordered={false}>
              {user?.is_admin ? 'Administrator' : 'Employee'}
            </Tag>
          </div>
        </>
      </Modal>
    </>
  )
}

export default Setting
