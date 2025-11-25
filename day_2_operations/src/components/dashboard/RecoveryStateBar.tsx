// import React from "react";
// import Chart from "react-apexcharts";
// import { DANGER, WARNING } from "../../constants/ColorConstant";

// const RecoveryStatBar = () => {
//   const xValues = ["AWS-DM-MUM", "AWS-DM-HYD", "AWS-DM-Ohio", "VMware"];
//   const yValues = [[1, 3, 0], [2, 2, 0], [1, 2, 3], [4, 2, 3]];

//   const series = [
//     { name: "Category A", data: yValues.map((item) => item[0]), group:"abc" },
//     { name: "Category B", data: yValues.map((item) => item[1]), },
//     { name: "Category C", data: yValues.map((item) => item[2]) },
//   ];

//   const options = {
//     bar: {
//         columnWidth: "10px", // Adjust the percentage to make bars thinner
//       },
//     chart: {
//       type: "bar",
//       stacked: true,
//       toolbar: { show: false },
//     },
//     grid:{
//         show:false
//     },
//     yaxis:{
//         labels: {
//           show:false,
//             style: {
//               colors: "#fff", // Change this to your desired color
//               fontSize: "14px", // Optional: Adjust font size
//             },
//           },
//     },
//     xaxis: {
//       categories: xValues,
//       labels: {
//         style: {
//           colors: "#fff", // Change this to your desired color
//           fontSize: "11px", // Optional: Adjust font size
//         },
//       },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: "20px",
//       },
//     },
//     legend: { position: "bottom", show:false },
//     dataLabels: { enabled: false },
//     colors: [DANGER, "#d88080",WARNING], // Optional: Define colors
//   };

//   return <Chart options={options} series={series} type="bar" height={200} />;
// };

// export default RecoveryStatBar;

import React from 'react';
import Chart from 'react-apexcharts';
import { SUCCESS } from '../../constants/ColorConstant';

const StackedGroupedBarChart = () => {
    const xValues = ['AWS-DM-MUM (RTO-5 MIN)', 'AWS-DM-HYD (RTO-10 MIN)', 'AWS-DM-Ohio (RTO-9 MIN)', 'VMware (RTO-8 MIN)'];

    const options = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
        },
        stroke: {
            show: false,
            width: 1,
            colors: ['transparent'],
        },
        dataLabels: {
            show: false,
        },
        grid: {
            show: false,
        },
        plotOptions: {
            bar: {
                horizontal: false, // Set to true for horizontal bars
                columnWidth: '30%',
                borderRadius: '2',
            },
        },

        xaxis: {
            categories: xValues,
            labels: {
                style: {
                    colors: '#fff',
                    fontSize: '9px',
                },
            },
        },
        fill: {
            opacity: 1,
        },
        yaxis: {
            labels: {
                show: false,
            },
        },

        colors: ['#0a9459', SUCCESS, '#ba5f88', '#f46a6a'],
        legend: {
            floating: false,
            show: true,
            position: 'bottom',
            horizontalAlign: 'left',
            labels: {
                colors: '#fff',
            },
            itemMargin: {
                horizontal: 10, // ✅ Adds spacing to keep items in a single row
            },
        },
    };

    const series = [
        { name: 'Test Recovery Passed', group: 'budget', data: [4, 5, 7, 3] },
        { name: 'Recovery Passed', group: 'actual', data: [3, 9, 3, 9] },
        { name: 'Test Recovery Failed', group: 'budget', data: [13, 8, 2, 9] },
        { name: 'Recovery Failed', group: 'actual', data: [3, 6, 4, 9] },
    ];

    return <Chart options={options} series={series} type="bar" height={250} />;
};

export default StackedGroupedBarChart;
