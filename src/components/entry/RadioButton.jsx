import { Radio } from 'antd'

const App = ({ value, options, handleChange }) => {
  return (
    <Radio.Group
      className="flex"
      options={options}
      onChange={handleChange}
      value={value}
      optionType="button"
    />
  )
}
export default App
