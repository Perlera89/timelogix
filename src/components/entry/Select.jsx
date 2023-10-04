import React from "react";
import { Select } from "antd";

// Filter `option.label` match the user type `input`
const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const App = ({select, placeholder}) => (
  <Select
    showSearch
    value={select}
    placeholder={placeholder || "Select"}
    optionFilterProp="children"
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
