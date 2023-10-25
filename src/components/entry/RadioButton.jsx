import React, { useState } from "react";
import { Radio } from "antd";

const options = [
  {
    label: "2022",
    value: "last",
  },
  {
    label: "2023",
    value: "current",
  },
  {
    label: "2024",
    value: "next",
  },
];

const App = () => {
  const [value3, setValue3] = useState("currentYear");

  const onChange3 = ({ target: { value } }) => {
    setValue3(value);
  };

  return (
    <Radio.Group
      options={options}
      onChange={onChange3}
      value={value3}
      optionType="button"
    />
  );
};
export default App;
