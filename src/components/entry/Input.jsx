import { Input } from 'antd'
import { IoTextSharp } from 'react-icons/io5'

const InputText = ({ placeholder, value, handleChange }) => {
  return (
    <Input
      allowClear
      showCount
      maxLength={10}
      className="w-full"
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
      addonBefore={<IoTextSharp />}
    />
  )
}

export default InputText
