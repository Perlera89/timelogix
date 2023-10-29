import { DatePicker } from "antd";
import dayjs from "dayjs";

const App = ({ value, placeholder, handleChange }) => {
  return (
    <DatePicker
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      className="w-full"
      defaultValue={dayjs("2022-10-16").format("MMM, DD YYYY")}
      format="MMM, DD YYYY"
    />
  );
};

export default App;
