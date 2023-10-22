import { Input } from "antd";
import { IoTextSharp } from "react-icons/io5";

const InputText = ({ placeholder, value, onChange }) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      addonBefore={<IoTextSharp />}
    />
  );
};

export default InputText;
