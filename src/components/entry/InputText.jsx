import { Input } from "antd";
import { MdOutlineFormatColorText } from "react-icons/md";

const InputText = ({value, onChange}) => {
  return (
    <Input value={value} addonBefore={<MdOutlineFormatColorText />} />
  );
};

export default InputText;
