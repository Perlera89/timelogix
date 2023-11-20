import { Table, Skeleton } from 'antd'

const SkeletonTable = () => {
  const SkeletonColumn = ({ dataIndex }) => {
    return {
      title: '',
      dataIndex,
      key: dataIndex,
      render: () => <Skeleton active />
    }
  }
  return (
    <Table
      dataSource={Array(3)
        .fill(null)
        .map((_, i) => ({ key: i }))}
      columns={[
        SkeletonColumn({ dataIndex: 'column1' }),
        SkeletonColumn({ dataIndex: 'column2' }),
        SkeletonColumn({ dataIndex: 'column3' }),
        SkeletonColumn({ dataIndex: 'column4' }),
        SkeletonColumn({ dataIndex: 'column5' }),
        SkeletonColumn({ dataIndex: 'column6' }),
        SkeletonColumn({ dataIndex: 'column7' })
      ]}
    />
  )
}

export default SkeletonTable
