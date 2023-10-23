import React from "react";
import { Input } from "antd";
const { TextArea } = Input;

const App = ({ placeholder, value, handleChange, maxLength }) => (
  <TextArea
    value={value}
    maxLength={maxLength || 500}
    style={{
      height: 120,
      resize: "none",
    }}
    onChange={handleChange}
    placeholder={placeholder || "Add a note"}
  />
);
export default App;
