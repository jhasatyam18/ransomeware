import React from 'react';
import recoveryVMSelection from '../assets/recoveryVMSelection.PNG';
import installCloudPackages from '../assets/recoveryInstallPackages.PNG';
import recoverySummary from '../assets/recoverySummary.PNG';
import fullRecoveryJobs from '../assets/fullRecoveryJobs.PNG';

export default function FullRecovery() {
  return (
    <div className="content">
      <h2>Full Recovery</h2>

      To perform full recovery after disaster in the source site, open Management Application on Recovery Site and go to
      <br />Home —> Configuration —> Protection Plan –> Click on the Protection plan.
      Click on Action button and select Recovery.


      <p><b>Prerequisite </b><br />
        At least one replication job has been completed successfully for the virtual machine and the sync status for that job should be init-success. </p>
      <b>Virtual Machines </b>
      <p>
        Select the virtual machines for the test recovery. Provide the credentials to execute the pre and postscripts. If there are no scripts for the virtual machine, then credentials are not mandatory.
        Credentials are not stored anywhere and only been used for the workflow.
        <br /><b>NOTE:</b> For Windows recovery on AWS, Credentials are mandatory even if there are no pre or post scripts is configured.
      </p>
      <img alt="" src={recoveryVMSelection} style={{ width: "75%", height: "75%" }} />
      <b>Recovery Configuration</b>
      <img alt="" src={installCloudPackages} style={{ width: "75%", height: "75%" }} />
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
      <img alt="" src={recoverySummary} style={{ width: "75%", height: "75%" }} />
      <p>Review the summary and click on finish to start the test recovery. This will start the test recovery jobs for the selected virtual machines and jobs can be monitored in the </p>
      <p>Home —> Jobs —> Recovery jobs</p>
      <p>NOTE: If the replication job is on-going at the time of Full Recovery, then the instance will be recovered from the last known good state. </p>
      <img alt="" src={fullRecoveryJobs} />
    </div>
  )
}

