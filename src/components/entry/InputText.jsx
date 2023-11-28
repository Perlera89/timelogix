import { Input } from 'antd'
import { useRef, useEffect } from 'react'
import { IoTextSharp } from 'react-icons/io5'

const InputText = ({ placeholder, value, handleChange, focus }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const handleInputChange = (e) => {
    const inputValue = e.target.value
    const regex = /^[a-zA-Z\s]+$/

    if (regex.test(inputValue) || inputValue === '') {
      handleChange(inputValue)
    }
  }

  return (
    <Input
      ref={inputRef}
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
