import React from "react";
import Search from "@/components/entry/Search";
import Employees from "@/components/timesheet/Employees";
import Dropdown from "@/components/common/Dropdown";

const TimesheetPage = () => {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Search />
          <div className="flex justify-end gap-2">
            <Dropdown title="Tracked hours" />
            <Dropdown title="Employees" />
          </div>
        </div>
        <Employees />
      </div>
    </div>
  );
};

export default TimesheetPage;
