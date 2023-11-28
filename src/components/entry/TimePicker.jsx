import React from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { TimePicker } from 'antd'
dayjs.extend(customParseFormat)

const App = ({ value, placeholder, handleChange, disabled }) => (
  <TimePicker
    disabled={disabled}
    value={value}
    placeholder={placeholder}
    onChange={handleChange}
    className="w-full"
    defaultValue={dayjs('00:00', 'HH:mm')}
    format="HH:mm"
  />
)
export default App
