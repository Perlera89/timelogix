import { Card } from "antd";

// icons
import { RiFilter3Fill } from "react-icons/ri";

const CardItem = ({ cardTitle, children, filterItems }) => {
  return (
    <Card
      title={cardTitle}
      size="small"
      extra={
        <RiFilter3Fill
          onClick={filterItems}
          className="text-3xl hover:bg-secondary-light rounded-xl p-1 cursor-pointer active:bg-secondary-light/70 transition-colors"
        />
      }
      style={{
        width: "100%",
      }}
    >
      {children}
    </Card>
  );
};

export default CardItem;
