import { Input } from "antd";
import { IoTextSharp } from "react-icons/io5";

const InputText = ({ placeholder, value, handleChange }) => {
  return (
    <Input
      className="w-full"
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
      addonBefore={<IoTextSharp />}
    />
  );
};

export default InputText;
