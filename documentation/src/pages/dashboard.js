import React from 'react'
import dashboardImg from '../assets/dashboard.PNG';
import dashboardTitle from '../assets/dashboardTitle.PNG';
import dashboardAlert from '../assets/dashboardAlert.PNG';
import dashboardEvents from '../assets/dashboardEvents.PNG';
import dashboardJobs from '../assets/dashboardJobs.PNG';
import dashboardReplStat from '../assets/dashboardReplStat.PNG';
import dashboardRpoRto from '../assets/dashboardRpoRto.PNG';
import dashboardSiteConnection from '../assets/dashboardSiteConnection.PNG';
import dashboardVMAnalysis from '../assets/dashboardVMAnalysis.PNG';
import dashboardUsage from '../assets/dashboardUsage.PNG';

export default function Dashboard() {
  return (
    <div className="content">
      <h2>Create VMware Site</h2>
      <p>The Dashboard provides you with an at-a-glance overview of the data protection status of your environment.</p>
      <img alt="" src={dashboardImg} />
      <p>Dashboard has following components which provides you the overall details about the configured environment.</p>
      <ol>
        <li><a href="#title_windows">Title Windows </a></li>
        <li><a href="#alertStat">Alert Statistics</a> </li>
        <li><a href="#rpoRto">RPO and RTO Statistics</a> </li>
        <li><a href="#replStat">Replication Statistics</a> </li>
        <li><a href="#jobs">Jobs </a></li>
        <li><a href="#vmpa">Virtual Machine Protection Analysis</a> </li>
        <li><a href="#bandwidthUsage">Bandwidth Usage</a> </li>
        <li><a href="#siteConnection">Site Connections </a></li>
        <li><a href="#events">Events </a></li>
      </ol>

      <div id="title_windows">
        <h3>Title Window</h3>
        <p>Title windows will give overall status on your configured and protected environment. </p>
        <img alt="" src={dashboardTitle} />
        <table style={{ width: '80%' }}>
          <thead>
            <th>Title</th>
            <th>Description  </th>
          </thead>
          <tbody>
            <tr>
              <td>Sites </td>
              <td>Sites configured on the node. </td>
            </tr>
            <tr>
              <td>Protection Plans </td>
              <td>Protection plans configured.  </td>
            </tr>
            <tr>
              <td>Protected Machines </td>
              <td>Total number of protected virtual machines </td>
            </tr>
            <tr>
              <td>Storage </td>
              <td>Overall protected storage size. </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="alertStat">
        <h3>Alert Statistics</h3>
        <p>Active alter which needs a user action acknowledgement or action on it. </p>
        <img alt="" src={dashboardAlert} style={{ width: "50%", height: "50%" }} />
      </div>

      <div id="rpoRto">
        <h3>RPO and RTO Statistics </h3>
        <p>Current recovery time objective and recovery point objective.  </p>
        <img alt="" src={dashboardRpoRto} />
        <table style={{ width: '80%' }}>
          <thead>
            <th>Title</th>
            <th>Description  </th>
          </thead>
          <tbody>
            <tr>
              <td>RPO </td>
              <td>Average recovery point objective value </td>
            </tr>
            <tr>
              <td>RTO </td>
              <td>Average of recovery time object value  </td>
            </tr>
            <tr>
              <td>Test Executions  </td>
              <td>Test executions completed successfully.  </td>
            </tr>
            <tr>
              <td>Full Recovery    </td>
              <td>Virtual machines recovered successfully.   </td>
            </tr>
            <tr>
              <td>Migrations    </td>
              <td>Virtual machines migrated successfully.   </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="replStat">
        <h3>Replication Statistics</h3>
        <p>Replication statistics provides a central snapshot overview of your protected environment replication jobs. </p>
        <img alt="" src={dashboardReplStat} />
        <table style={{ width: '80%' }}>
          <thead>
            <th>Title</th>
            <th>Description  </th>
          </thead>
          <tbody>
            <tr>
              <td>Completed  </td>
              <td>Successfully completed replication iterations. </td>
            </tr>
            <tr>
              <td>Running  </td>
              <td>Replication iterations are in-progress. </td>
            </tr>
            <tr>
              <td>Failed  </td>
              <td>Failed replication iterations. </td>
            </tr>
            <tr>
              <td>Change Rate  </td>
              <td>Average data change rate for all protected virtual machines  </td>
            </tr>
            <tr>
              <td>Data Reduction  </td>
              <td>Average percentage of data reduction for all the completed replications. </td>
            </tr>

          </tbody>
        </table>
      </div>

      <div id="jobs">
        <h3>Jobs</h3>
        <p>Jobs shows the recently started or completed task in the system.  </p>
        <img alt="" src={dashboardJobs} style={{ width: "50%", height: "50%" }} />
      </div>

      <div id="vmpa">
        <h3>Virtual Machine Protection Analysis </h3>
        <p>Virtual machine protection analysis shows the overall status of recovery site environment in terms of total discovered virtual machines with percentage of protected and unprotected virtual machines. In addition to protection analysis, this wizard also provides the details for replication statistics of virtual machines which are in-sync and not in-sync.  </p>
        <img alt="" src={dashboardVMAnalysis} />
      </div>

      <div id="bandwidthUsage">
        <h3>Bandwidth Usage </h3>
        <p>Bandwidth usage provide the details network usage of the system for last 12 hours. The bandwidth usage chart shows data downloaded and uploaded for last 12 hours</p>
        <img alt="" src={dashboardUsage} />
      </div>

      <div id="siteConnection">
        <h3>Site Connections  </h3>
        <p>
          Provides connection details of configured sites in terms of data flow i.e., from which source site data replication is configured for target site.
        </p>
        <img alt="" src={dashboardSiteConnection} style={{ width: "50%", height: "50%" }} />
      </div>

      <div id="events">
        <h3>Events </h3>
        <p>
          Events are records of user actions or system actions that got occurred in the Datamotive system. In dashboard event component will give you the most recent events generate in the system.
        </p>
        <img alt="" src={dashboardEvents} style={{ width: "50%", height: "50%" }} />
      </div>

    </div>
  )
}
