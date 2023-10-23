import React from "react";
import { Select, Typography } from "antd";

const { Text } = Typography;

const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const App = ({ value, placeholder, options, handleSelect }) => (
  <Select
    showSearch
    value={value}
    onSelect={handleSelect}
    placeholder={placeholder || "Select"}
    options={options}
    filterOption={filterOption}
    notFoundContent={
      <Text className="flex justify-center my-2" type="secondary">
        No data
      </Text>
    }
    className="w-full"
  />
);

export default App;
