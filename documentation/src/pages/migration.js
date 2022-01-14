import React from 'react'
import migrationPreList from '../assets/migrationPreList.PNG';
import migrationVMs from '../assets/migrationVMs.PNG';
import migrationCloudpackages from '../assets/migrationCloudpackages.PNG';
import migrationSummary from '../assets/migrationSummary.PNG';
import migrationSuccessList from '../assets/migrationSuccessList.PNG';

export default function Migration() {
  return (
    <div className="content">
      <h2>Migration</h2>
      To migrate the workloads, go to Home —> Configuration —> Protection Plan a Click on the protection on which migration need to perform, on the Recovery site.
      <br />Click on actions buttons and select Migrate
      <p><b>Prerequisite </b><br /></p>
      <p>In case of migration, to make sure there is no loss of data, the virtual machine(s) should be in power off state and the last replication jobs should be successfully completed with zero changed data. </p>
      <img alt="" src={migrationPreList} />


      <b>Virtual Machines </b>
      <img alt="" src={migrationVMs} style={{ width: "75%", height: "75%" }} />
      <p>
        Select the virtual machines and provide the credentials if there are pre- or post-configured for these virtual machines.
        <strong>Note: For Windows machine in AWS, credentials are mandatory.</strong>
      </p>



      <b>Recovery Configuration</b>
      <img alt="" src={migrationCloudpackages} style={{ width: "75%", height: "75%" }} />
      <table>
        <tr>
          <td><b>Install System Agents </b></td>
          <td>For AWS, install OS agents like EC2Launch and SSMAgents. For GCP, install
            google os-config and compute-engine agents.</td>
        </tr>
        <tr>
          <td><b>Install Cloud Packages</b></td>
          <td>For AWS. install AWS Cloud SDK and for GCP, install GCP Cloud SDK. </td>
        </tr>
      </table>


      <b>Summary </b>
      <img alt="" src={migrationSummary} style={{ width: "75%", height: "75%" }} />
      <p>Review the summary and click on finish to start the Migration. This will start the test migration jobs for the selected virtual machines and jobs can be monitored in the Home —> Jobs —> Recovery jobs.</p>

      <p>Job's view after migration completed</p>
      <img alt="" src={migrationSuccessList} />
    </div>
  )
}
