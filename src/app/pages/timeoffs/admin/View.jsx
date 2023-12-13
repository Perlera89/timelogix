import React from 'react'
import { Tag, Typography, Divider } from 'antd'
import dayjs from 'dayjs'

// components
import Avatar from '@/components/common/Avatar'

const { Text } = Typography

const ViewTimeOff = ({ timeoff, color, icon }) => {
  return (
    <>
      <div className="flex gap-4 items-center">
        <Avatar letter="D" size="large">
          <p className="text-lg">{timeoff.employee.name[0]}</p>
        </Avatar>
        <div className="flex flex-col">
          <Text>{timeoff.employee.name}</Text>
        </div>
      </div>
      <Divider />
      <div className="flex gap-4 my-4">
        <Text>Type:</Text>
        <Tag bordered={false} color={timeoff.type.color}>
          {timeoff.type.name}
        </Tag>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Start date:</Text>
        <Text type="secondary">
          {dayjs(timeoff.join_date).format('MMM, DD YYYY')}
        </Text>
      </div>
      <div className="flex gap-4 my-4">
        <Text>End date:</Text>
        <Text type="secondary">
          {timeoff.end_date
            ? dayjs(timeoff.end_date).format('MMM, DD YYYY')
            : 'No date'}
        </Text>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Status:</Text>
        <Tag
          bordered={false}
          color={color}
          icon={icon}
        >
          {timeoff.status}
        </Tag>
      </div>
      <div className="flex flex-col">
        <Text>Note</Text>
        <Text type="secondary">{timeoff.note}</Text>
      </div>
    </>
  )
}

export default ViewTimeOff
