import React from 'react'
import replicationJobsDisk from '../assets/replicationJobsDisk.PNG';
import replicationJobsVM from '../assets/replicationJobsVM.PNG';
import replicationJobsPP from '../assets/replicationJobsPP.PNG';
export default function ReplicationJobs() {
  return (
    <div className="content">
      <h2>Replication Jobs</h2>
      <b>Navigation</b> Home --> Jobs --> Replication
      <p>
        You can use the replication jobs page to monitor the overall status of replication.
        The Replication Jobs tab provides details about all the running, completed, and failed replication iterations.
        <br />The Replication job section has the following sub-section to show replication jobs base on the grouping criteria.
        <ol>
          <li><a href="#replicationPP">Protection Plan</a></li>
          <li><a href="#replicationVM">Virtual Machines</a></li>
          <li><a href="#replicationDisk">Disks</a></li>
        </ol>
      </p>

      <div id="replicationPP">
        <h4>Protection Plan </h4>
        <p>Navigation: Home --> Jobs --> Replication and Select Protection Plan.</p>
        <p>Protection plan replication details provide a list of protection plans. Each protection plan has its associated virtual machine replication information.</p>
        <p>click  icon '&gt;' or <b>title</b> to view protection plan level details. </p>
        <img src={replicationJobsPP} />
        <table>
          <tr>
            <td><b>Name </b></td>
            <td>Name of virtual machine associated with the protection plan. </td>
          </tr>
          <tr>
            <td><b>Iteration  </b></td>
            <td>The total number of replication iterations completed. </td>
          </tr>
          <tr>
            <td><b>Total Changed  </b></td>
            <td>Total data changed. </td>
          </tr>
          <tr>
            <td><b>Total Transferred  </b></td>
            <td>Overall data reduction. </td>
          </tr>
          <tr>
            <td><b>Job Status  </b></td>
            <td> Status of latest replication iteration.
              <ol>
                <li><b>Completed:</b> Replication was completed successfully. </li>
                <li><b>Started:</b>  Replication is running. </li>
                <li><b>Partially Completed:</b> Replication completed with errors. </li>
                <li><b>Failed: </b> Replication failed. </li>
              </ol>
            </td>
          </tr>
          <tr>
            <td><b>Sync Status   </b></td>
            <td>
              Virtual machine sync status
              <ol>
                <li><b>Init-success:</b> The first iteration completed successfully</li>
                <li><b>Init-in-progress: </b>The first iteration is running. </li>
                <li><b>Init-failed:</b> The first iteration failed. </li>
                <li><b>In-sync:</b> Iteration is completed within configured replication interval time. </li>
                <li><b>Exceeded interval:</b> Iteration is completed but took more time than configured replication interval time. </li>
                <li><b>Sync-failed:</b> Replication iteration failed. </li>
              </ol>
            </td>
          </tr>
        </table>
      </div>

      <div id="replicationVM">
        <h4>Virtual Machines</h4>
        Provides a list of replication details for each protected virtual machine.
        <img src={replicationJobsVM} />
        <table>
          <tr>
            <td><b>Virtual Machine </b></td>
            <td>Name of the protected virtual machine. </td>
          </tr>
          <tr>
            <td><b>Iteration </b></td>
            <td>Total number of replication iterations completed. </td>
          </tr>
          <tr>
            <td><b>Changed </b></td>
            <td>Total changed data discovered. </td>
          </tr>
          <tr>
            <td><b>Transferred </b></td>
            <td>Total data transferred to the replication server. </td>
          </tr>
          <tr>
            <td><b>Replication Duration </b></td>
            <td>Time took to complete iteration. </td>
          </tr>
          <tr>
            <td><b>Job Status </b></td>
            <td>Status of replication iteration. </td>
          </tr>
          <tr>
            <td><b>Sync Status </b></td>
            <td>Virtual machine sync status. </td>
          </tr>
        </table>
        <strong>Note: Hover on the Sync Status column to get details of the status. Hover on the Replication Duration column to get Replication start & end time.</strong>
      </div>
      <div id="replicationDisk">
        <h4>Disks </h4>
        Provide a list of replication details for each protected virtual machine disk/volume.
        <img src={replicationJobsDisk} />
        <table>
          <tr>
            <td><b> Virtual Machine </b></td>
            <td>Name of the protected virtual machine. </td>
          </tr>
          <tr>
            <td><b>Disk Id  </b></td>
            <td>Disk id of virtual machine. </td>
          </tr>
          <tr>
            <td><b> Data Changed </b></td>
            <td>Total changed data discovered for the disk. </td>
          </tr>
          <tr>
            <td><b> Data Transferred </b></td>
            <td>Total data transferred to the replication server. </td>
          </tr>
          <tr>
            <td><b> Replication Duration </b></td>
            <td>Time took to complete iteration. </td>
          </tr>
          <tr>
            <td><b>Job Status  </b></td>
            <td>Status of replication iteration. </td>
          </tr>
        </table>
      </div>

    </div>
  )
}
