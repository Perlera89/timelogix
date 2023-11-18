import { Table } from 'antd'

const App = ({ locale, columns, data, loading }) => (
  <Table
    locale={locale}
    columns={columns}
    dataSource={data}
    loading={loading}
    scroll={{
      x: 'auto'
    }}
  />
)
export default App
