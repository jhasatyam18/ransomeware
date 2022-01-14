import React from 'react';
import testRecoveryVMSelection from '../assets/testRecoveryVMSelection.PNG';
import installCloudPackages from '../assets/testRecoveryinstallPackages.PNG';
import testRecoverySummary from '../assets/testRecoverySummary.PNG';
import testRecoveryJobs from '../assets/testRecoveryJobs.PNG';

export default function TestRecovery() {
  return (
    <div className="content">
      <h2>Test Recovery</h2>
      <p>For Test Recovery workflow, go to <br />
      Home —> Configuration —> Protection Plan on the server side. Click on Test Recover and Test Recovery window will pop-up.</p>

      <p><b>Prerequisite </b><br />
        At least one replication job has been completed successfully for the virtual machine and the sync status for that job should be In-synch.
      </p>
      <b>Virtual Machines </b>
      <p>
        Select the virtual machines for the test recovery. Provide the credentials to execute the pre and post scripts. If there are no scripts for the virtual machine, then credentials are not mandatory.
        Credentials are not stored anywhere and only been used for the workflow.
        <br /><b>NOTE:</b> For Windows recovery on AWS, Credentials are mandatory even if there are no pre or post scripts is configured.
      </p>
      <img src={testRecoveryVMSelection} style={{ width: "75%", height: "75%" }} />
      <b>Recovery Configuration</b>
      <img src={installCloudPackages} style={{ width: "75%", height: "75%" }} />
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
      <img src={testRecoverySummary} style={{ width: "75%", height: "75%" }} />
      <p>Review the summary and click on finish to start the test recovery. This will start the test recovery jobs for the selected virtual machines and jobs can be monitored in the <br /> Home —> Jobs —> Recovery jobs tab</p>
      <img src={testRecoveryJobs} style={{ width: "75%", height: "75%" }} />


      <h2>Test Recovery validation</h2>
      <p>Check the status of the virtual machine's recovery jobs in the Home —> Jobs —> Recovery.</p>
      <p>Check the Cloud Console (AWS and GCP) for the instances with the virtual machines name and their running status. AWS also has status checks. </p>
      <p>On successful completion of recovery jobs, IP Address can be found for the new running instances. </p>
      <p>For Windows machines, download the RDP file by click the download button right next to the IP address and check the windows machine through RDP.</p>
      <p>
        For Linux machines, copy the IP address and check the linux machine through ssh.<br />
        <strong>Note: Once the validations are completed, Datamotive recommends to remove the Test Recovered instance.</strong>
      </p>

    </div>
  )
}

