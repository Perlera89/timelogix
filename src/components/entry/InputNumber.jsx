import { InputNumber } from 'antd'

import { MdNumbers } from 'react-icons/md'

const App = ({ placeholder, value, onChange }) => {
  return (
    <InputNumber
      placeholder={placeholder}
      addonBefore={<MdNumbers />}
      className="w-full"
      type="number"
      value={value.trim()}
      onChange={onChange}
    />
  )
}

export default App
