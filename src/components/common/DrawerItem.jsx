import { Drawer } from "antd";

const DrawerItem = ({ title, children, placement, isOpen, isClose }) => {
  return (
    <>
      <Drawer
        title={title}
        placement={placement}
        onClose={isClose}
        open={isOpen}
      >
        {children}
      </Drawer>
    </>
  );
};
export default DrawerItem;
