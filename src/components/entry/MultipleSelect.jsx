import { Select } from 'antd'

const App = ({ placeholder, options, handleSelect }) => {
  const filterOption = (input, option) => {
    const label = option?.label
    const labelValue = typeof label === 'object' ? label.props.children : label
    return labelValue.toLowerCase().includes(input.toLowerCase())
  }

  return (
    <Select
      allowClear
      mode="multiple"
      style={{
        width: '100%'
      }}
      filterOption={filterOption}
      placeholder={placeholder || 'Select'}
      onChange={handleSelect}
      options={options}
    />
  )
}
export default App
