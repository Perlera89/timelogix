"use client"
import { Input } from "antd";

const Search = ({text, onSearch}) => {
  const { Search } = Input;

  return (
    <Search
      placeholder={text ? text : "Search"}
      className="md:mr-4 xl:w-[400px] w-full"
      onSearch={value => onSearch(value)}
      enterButton
    />
  );
};

export default Search;
