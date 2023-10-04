import { Table } from "antd";

const App = ({ locale, columns, data }) => (
  <Table locale={locale} columns={columns} dataSource={data} scroll={{
    x: 'auto',
  }} />
);
export default App;
