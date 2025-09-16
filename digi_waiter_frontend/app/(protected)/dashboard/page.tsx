import React from "react";
import BasicDetailsCards from "./BasicDetailsCards";
import LineGraph from "./LineGraph";
import DoughnutCategories from "./DoughnutCategories";
import RecentOrdersTable from "./RecentOrdersTable";
const page = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div>
        <BasicDetailsCards />
        <div className="m-4 p-4 flex flex-col gap-2 lg:flex-row rounded-lg">
          <div className="flex-2 w-full bg-white shadow-md p-4 rounded-lg">
            <LineGraph />
          </div>
          <div className="flex items-center justify-center flex-1 w-full bg-white shadow-md p-4 rounded-lg">
            <DoughnutCategories />
          </div>
        </div>
        <RecentOrdersTable />
      </div>
    </div>
  );
};

export default page;
