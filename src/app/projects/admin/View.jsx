import { Tag, Typography } from 'antd'

const { Text, Title } = Typography

const ViewProject = ({ project }) => {
  return (
    <>
      <div className="flex gap-4 items-center">
        <Title level={4}>{project.name}</Title>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Code:</Text>
        <Text type="secondary">{project.code}</Text>
      </div>
      <div className="flex gap-4 my-4">
        <Text>Type:</Text>
        <Tag bordered={false} color={project.type.color}>
          {project.type.name}
        </Tag>
      </div>
      <div className="flex flex-col gap-4 my-4">
        <Text>Activities:</Text>
        <div className="flex gap-2">
          {project.activities.map((activity) => (
            <Tag bordered={false} color={activity.color}>
              {activity.code}
            </Tag>
          ))}
        </div>
      </div>
    </>
  )
}

export default ViewProject
