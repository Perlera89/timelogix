import React from 'react'
import { Tag, Typography } from 'antd'
import dayjs from 'dayjs'

const { Text, Title } = Typography

const ViewHoliday = ({ holiday }) => {
  return (
    <>
      <div className="flex gap-4 items-center">
        <Title level={4}>{holiday.name}</Title>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Type:</Text>
        <Tag bordered={false} color={holiday.type.color}>
          {holiday.type.name}
        </Tag>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Start date:</Text>
        <Text type="secondary">
          {dayjs(holiday.start_date).format('MMM, DD YYYY')}
        </Text>
      </div>
      <div className="flex gap-4 my-4">
        <Text>End date:</Text>
        <Text type="secondary">
          {holiday.end_date
            ? dayjs(holiday.end_date).format('MMM, DD YYYY')
            : 'No date'}
        </Text>
      </div>
    </>
  )
}

export default ViewHoliday
