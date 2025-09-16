import React from "react";

const BasicDetailsCards = () => {
  const details = [
    { title: "Daily Orders", value: 120 },
    { title: "Total Tables", value: 15 },
    { title: "Today Sales", value: 105 },
    { title: "Number of items", value: 2500 },
  ];
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-4 sm:grid-cols-2">
        {details.map((detail, index) => (
          <div
            key={index}
            className={`aspect-auto rounded-xl flex flex-col items-start justify-center p-4 shadow-md border-2 border-gray-200 bg-white`}
          >
            <h2 className="text-lg font-semibold">{detail.title}</h2>
            <p className="text-3xl font-bold">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicDetailsCards;
