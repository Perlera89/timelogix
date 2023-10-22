import React from "react";
import { Select } from "antd";

// Filter `option.label` match the user type `input`
const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const App = ({value, placeholder}) => (
  <Select
    showSearch
    value={value}
    placeholder={placeholder || "Select"}
    optionFilterProp={optins}
    onChange={null}
    onSearch={null}
    filterOption={filterOption}
    className="w-full"
    options={[
      {
        value: "tag1",
        label: "Etiqueta 1",
      },
      {
        value: "lucy",
        label: "Lucy",
      },
      {
        value: "tom",
        label: "Tom",
      },
    ]}
  />
);
export default App;
