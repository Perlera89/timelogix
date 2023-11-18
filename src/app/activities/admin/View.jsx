import React from 'react'
import { Typography } from 'antd'

import Avatar from '@/components/common/Avatar'

const { Text, Title } = Typography

const ViewEmployee = ({ activity }) => {
  return (
    <>
      <div className="flex gap-4 items-center">
        <Title level={4}>{activity.name}</Title>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Code:</Text>
        <Text type="secondary">{activity.code}</Text>
      </div>
      <div className="flex flex-col gap-4 my-4">
        <Text>Employees:</Text>
        <div className="flex flex-col gap-2">
          {activity.employees.map((employee) => (
            <div className="flex gap-4 items-center">
              <Avatar letter="D" size="large">
                <p className="text-lg">{employee.name[0]}</p>
              </Avatar>
              <div className="flex flex-col">
                <Text>{employee.name}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <Text>Description: </Text>
        <Text type="secondary">{activity.description}</Text>
      </div>
    </>
  )
}

export default ViewEmployee
