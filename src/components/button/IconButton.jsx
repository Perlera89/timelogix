import { Button } from "antd";

const IconButton = ({ icon, size, click }) => {
  return (
    <Button
      type="text"
      className="flex justify-center items-center transition-colors rounded-full"
      icon={icon}
      size={size}
      onClick={click}
    />
  );
};

export default IconButton;
