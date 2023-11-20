import React from 'react'
import { Select, Typography } from 'antd'

const { Text } = Typography

const filterOption = (input, option) => {
  const label = option?.label
  const labelValue = typeof label === 'object' ? label.props.children : label
  return labelValue.toLowerCase().includes(input.toLowerCase())
}

const App = ({ value, placeholder, options, handleSelect }) => (
  <Select
    showSearch
    allowClear
    value={value}
    onSelect={handleSelect}
    placeholder={placeholder || 'Select'}
    options={options}
    filterOption={filterOption}
    notFoundContent={
      <Text className="flex justify-center my-2" type="secondary">
        No data
      </Text>
    }
    className="w-full min-w-[150px]"
  />
)

export default App
