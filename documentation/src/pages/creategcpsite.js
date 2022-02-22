import React from 'react';
import gcpCS from '../assets/gcpCS.PNG';
import gcpSite from '../assets/gcpSite.PNG';
import siteNavigation from '../assets/siteNavigation.PNG';
export default function CreateGcpSite() {
  return (
    <div class="content">
      <h2>Create GCP Site</h2>

      <p>Sites are environment setup for Protection plan to configure. Site consists of platform type and platform details. In the Datamotive UI, go to Configure tab on the left-hand side panel and select Sites.</p>
      <img alt="" src={siteNavigation} />
      <p>
        Site can be of following types: <br />
        Protection - A protection site is the source of the protection plan workload replication.<br />
        Recover - A Recover site is the destination for the protection plan workload replication.<br />
      </p>


      Following are the required inputs for the GCP site configurations.

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
          <td><b>Region</b></td>
          <td>GCP region where the workload will be replicated and recovered.</td>
        </tr>
        <tr>
          <td><b>Zone</b></td>
          <td>GCP zone where the workload will be replicated and recovered.</td>
        </tr>
        <tr>
          <td><b>Project ID</b></td>
          <td>GCP Project ID where the workload will be replicated and recovered.</td>
        </tr>
      </table>

      <img alt="" src={gcpSite} />

      <p>Click on configure to create the site and on successful creation, site will be listed in the list view.
        <img alt="" src={gcpCS} />
      </p>
    </div>
  );
}
