import React from 'react';
import report from '../assets/reports.PNG';
import filter from '../assets/reportFilter.PNG';
import reportData from '../assets/reportData.PNG';

export default function Reports() {
  return (
    <div className="content">
      <h2>Reports</h2>
     Navigation --> Monitor --> Report
      <p>Datamotive provides mechanism to generate Reports listing Nodes, Events, Alerts or Jobs in the system. To generate reports, go to “Monitor” Tab and click on “Reports” option-</p>
      <img src={report} />
      To generate a Report, click on “Filter” option.
      Reports can be generated for 2 types –
      <ul>
        <li class="item1">Overall System data, all the system data is included in the report</li>
        <li class="item2">Protected Plans, selected protection plan data is included in the report.</li>
      </ul>
      <img src={filter} />
      <ul>
        <li class="item1">Check the components which you want to include in the report.</li>
        <li class="item2">For Protection plan dropdown select if you want to include all protection plan details in the report. Or select a specific plan whose report is required.</li>
      </ul>
      <p>Once the options are selected, click on “Generate Report” for the report to be generated. </p>
      <img src={reportData} />
      <b>
        <p>Click on export button to export data to .PDF format. </p>
      </b>
    </div>
  )
}
