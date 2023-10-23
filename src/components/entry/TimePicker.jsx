import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TimePicker } from "antd";
dayjs.extend(customParseFormat);

const onChange = (time, timeString) => {
  const formattedTime = dayjs(time).format("HH:mm");
  console.log(formattedTime);
};

const App = ({ value, placeholder, handleChange }) => (
  <TimePicker
    value={value}
    placeholder={placeholder}
    onChange={handleChange}
    className="w-full"
    defaultValue={dayjs("00:00", "HH:mm")}
    format="HH:mm"
  />
);
export default App;