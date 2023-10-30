import React from "react";

import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Result, Typography } from "antd";
const { Paragraph, Text } = Typography;
const App = ({ title, subtitle, error, open, handleClose }) => (
  <Modal
    open={open}
    width={800}
    closable
    onCancel={handleClose}
    centered
    className="z-50"
    footer={[
      <Button
        key="save"
        type="primary"
        className="bg-tomato"
        onClick={handleClose}
      >
        Close
      </Button>,
    ]}
  >
    <Result status="error" title={title} subTitle={subtitle} className="px-0" />
  </Modal>
);

export default App;
