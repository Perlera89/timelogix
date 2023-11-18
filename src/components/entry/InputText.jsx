import { Input } from 'antd'
import { IoTextSharp } from 'react-icons/io5'

const InputText = ({ placeholder, value, handleChange }) => {
  const handleInputChange = (e) => {
    const inputValue = e.target.value
    const regex = /^[a-zA-Z\s]+$/

    if (regex.test(inputValue) || inputValue === '') {
      handleChange(inputValue)
    }
  }

  return (
    <Input
      allowClear
      showCount
      maxLength={100}
      className="w-full"
      placeholder={placeholder}
      onChange={handleInputChange}
      value={value}
      addonBefore={<IoTextSharp />}
    />
  )
}

export default InputText
