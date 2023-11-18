import Activities from './pages/Activities'
import Projects from './pages/Projects'
import { ConfigProvider, Tabs } from 'antd'

const ProjectsPage = () => {
  const labels = ['Projects', 'Activities']
  const contents = [
    <Projects />,
    <Activities />
  ]
  return (
    <ConfigProvider>
    <Tabs
      defaultActiveKey='1'
      items={new Array(2).fill(null).map((_, i) => {
        const id = String(i + 1)
        return {
          label: labels[i],
          key: id,
          children: contents[i]
        }
      })}
      size='small'
    />
  </ConfigProvider>
  )
}

export default ProjectsPage
