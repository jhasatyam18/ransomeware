import React from 'react'
import recoveryJobsPP from '../assets/recoveryJobsPP.PNG';
import recoveryJobsVM from '../assets/recoveryJobsVM.PNG';
export default function RecoveryJobs() {
  return (
    <div className="content">
      <h2>Recovery Jobs</h2>
      <b>Navigation</b> Home --> Jobs --> Recovery
      <p>
        The Recovery jobs tab provides details about all the running, completed and failed recovery operations.
        <br />The Replication job section has the following sub-section to show replication jobs base on the grouping criteria.
        <ol>
          <li><a href="#recoveryPP">Protection Plan</a></li>
          <li><a href="#recoveryVM">Virtual Machines</a></li>
        </ol>
      </p>

      <div id="recoveryPP">
        <h4>Protection Plan </h4>
        <p>Protection plan recovery details provide a list of protection plans. Each protection plan has its
          associated recovered (Full / Test) or migrated virtual machine information. </p>
        <p>click  icon '&gt;' or <b>title</b> to view protection plan level details. </p>
        <img alt="" src={recoveryJobsPP} />
        <table>
          <tr>
            <td><b>Name </b></td>
            <td>Name of virtual machine associated with the protection plan.  </td>
          </tr>
          <tr>
            <td><b>Duration   </b></td>
            <td>The time required to complete the recovery. </td>
          </tr>
          <tr>
            <td><b>Recovery Type </b></td>
            <td>Recovery Type (Full Recovery, Test Recovery or Migration)  </td>
          </tr>
          <tr>
            <td><b>Status </b></td>
            <td>Recovery/Migration status.  </td>
          </tr>
        </table>
      </div>

      <div id="recoveryVM">
        <h4>Virtual Machines</h4>
        Provides a list of recovered (Test/Full) or migrated virtual machines.
        <img alt="" src={recoveryJobsVM} />
        <table>
          <tr>
            <td><b>Virtual Machine </b></td>
            <td>Name of virtual machine.  </td>
          </tr>
          <tr>
            <td><b>Duration  </b></td>
            <td>The time required to complete the recovery/migration. </td>
          </tr>
          <tr>
            <td><b>Recovery Type  </b></td>
            <td>Recovery Type (Full Recovery, Test Recovery or Migration)  </td>
          </tr>
          <tr>
            <td><b>Job Status  </b></td>
            <td>Recovery job status.
              <ol>
                <li><b>Completed:</b> Recovery completed successfully. </li>
                <li><b>Started:</b>  Recovery job is running. </li>
                <li><b>Partially Completed: </b>Recovery completed with errors. </li>
                <li><b>Failed:</b>  Recovery failed</li>
              </ol>
            </td>
          </tr>
          <tr>
            <td><b>IP Address  </b></td>
            <td>Recovered virtual machine IP address.  </td>
          </tr>
        </table>
      </div>
    </div>
  )
}
