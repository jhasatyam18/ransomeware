import React from 'react';
import siteNavigation from '../assets/siteNavigation.PNG';
import vmwareCS from '../assets/vmwareCS.PNG';
import VMwareSite from '../assets/vmwareSite.PNG';
export default function Createvmwaresite() {
  return (
    <div class="content">
      <h2>Create VMware Site</h2>
      <p>Sites are environment setup for Protection plan to configure. Site consists of platform type and platform details. In the Datamotive UI, go to Configure tab on the left-hand side panel and select Sites.</p>
      <img alt="" src={siteNavigation} />
      <p>
        Site can be of following types: <br />
        Protection - A protection site is the source of the protection plan workload replication.<br />
        Recover - A Recover site is the destination for the protection plan workload replication.<br />
      </p>

      Following are the required inputs for the VMware site configurations.
      <table>
        <tr>
          <td><b>Site Type</b></td>
          <td>(Protect/Recover) - Select the site type based on source or destination.</td>
        </tr>
        <tr>
          <td><b>Platform Type </b></td>
          <td>Select the Platform type - VMware/AWS/GCP.</td>
        </tr>
        <tr>
          <td><b>Platform Name </b></td>
          <td>Provide name for this platform.</td>
        </tr>
        <tr>
          <td><b>Description</b></td>
          <td>Provide description for the site.</td>
        </tr>
        <tr>
          <td><b>Node</b></td>
          <td>Select the node from the list</td>
        </tr>
        <tr>
          <td><b>VCenter Server IP</b></td>
          <td>vCenter server IP or hostname.</td>
        </tr>
        <tr>
          <td><b>Port </b></td>
          <td>vCenter server management service port (default is 443).</td>
        </tr>
        <tr>
          <td><b>Username</b></td>
          <td>vCenter server username.</td>
        </tr>
        <tr>
          <td><b>Password</b></td>
          <td>vCenter server password.</td>
        </tr>
      </table>

      <img alt="" src={VMwareSite} />


      <p>Click on configure to create the site and on successful creation, site will be listed in the list view.
        <img alt="" src={vmwareCS} />
      </p>
    </div>
  );
}
