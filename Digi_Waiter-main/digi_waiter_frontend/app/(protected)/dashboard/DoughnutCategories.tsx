"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register needed components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DoughnutCategories = () => {
  const graphData = {
    labels: ["Breakfast", "Bar", "Lunch", "Dinner", "Dessert"],
    datasets: [
      {
        label: "Votes",
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Popular Categories",
        font: { size: 20 },
      },
    },
  };

  return (
    <div>
      <Doughnut data={graphData} options={graphOptions} />
    </div>
  );
};

export default DoughnutCategories;
