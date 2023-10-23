import { MdInfo } from "react-icons/md";
import { Badge } from "antd";

const App = ({ title, validate, children }) => {
  return (
    <Badge
      count={
        validate ? null : (
          <MdInfo
            title={title}
            className={`text-red-500 z-50 cursor-pointer`}
          />
        )
      }
      className="w-full"
    >
      {children}
    </Badge>
  );
};

export default App;
