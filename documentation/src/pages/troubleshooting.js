import React from 'react'

export default function Troubleshooting() {
  return (
    <div className="content">
      <h2>Troubleshooting</h2>
      <ol>
        <li>
          Replication Failures
          <ol type='a'>
            <li class="item1">
              Snapshot Creation Failed
              <ol type="i">
                <li class="item1">Error: Snapshot Creation Failed</li>
                <li class="item2">Impact: Replication fails for all disks of the VM</li>
                <li class="item3">Resolution: Locate the VM in protected infrastructure using the console (AWS Console, GCP Console, vCenter Server) & Delete all snapshots named “DM_REPL_SNAP”.</li>
              </ol>
            </li>
            <li class="item2">Error while attaching Volume
              <ol type="i">
                <li class="item1">Error: Error while attaching volume</li>
                <li class="item2">Impact: Replication fails for all disks of the VM</li>
                <li class="item3">Resolution: In case the recovery site is AWS or GCP and during protection of VM IOPs are specified, then based on the conditions specified by the cloud provider, the IOPs value may need to be altered.</li>
              </ol>

            </li>
            <li class="item3">VM not found
              <ol type="i">
                <li class="item1">Error: VM not found</li>
                <li class="item2">Impact: Replication fails for all disks of the VM</li>
                <li class="item3">Resolution: This error happens when a protected virtual machine is renamed. Datamotive detects this change and generates an alert but doesn’t update it’s records unless user takes specific action against that alert. Subsequent replication iterations of the VM keep failing. To resolve this issue. locate the Alert corresponding to given VM and “Take Action” on it. It will open up Edit Protection Plan wizard which should be completed. Once the protection plan is successfully edited, the VM’s replication should start again.</li>
              </ol>
            </li>
          </ol>
        </li>
        <li class="item4">Protection Plan Failures
          <ol type="a">
            <li class="item1">Edit Protection Plan Failed
              <ol type='i'>
                <li class="item1">Error: VM not found</li>
                <li class="item2">Impact: Protection Plan cannot be edited</li>
                <li class="item3">Resolution: This error can occur when one or more VMs in the protection plan have configuration changes for which user has not taken any action on. To resolve this issue, close the edit protection plan wizard. Go to Alerts section and make sure that you take action on all alerts for VMs within that protection plan. Each action will take ensure the VM’s data is synced with Datamotive. Once all the VMs are updated, then edit protection plan should work as expected.</li>
              </ol>
            </li>
          </ol>
        </li>
        <li>
          Recovery Failures
          <ol type='a'>
            <li>
              AWS: Instance not reachable | Check Instance timed out
              <ol type='i'>
                  <li>Error: Instance timed out </li>
                  <li>Impact: Instance is not recovered. ½ checks pass for AW</li>
                  <li>Resolution: This error occurs when protected VM doesn’t meet the supported OS criteria. For details, please refer to section Support Matrix in this document.</li>
              </ol>
            </li>
            <li>
              Windows disks are offline
              <ol type='i'>
                  <li>Error: After successful recovery of Windows VMs, disks other than the boot disk are found offline </li>
                  <li>Impact: Applications/data if deployed/present on disks other than the boot disks are not accessible. </li>
                  <li>Resolution: This error occurs in case of Windows VMs with multiple disks having disk policy configured as Offline. Edit the disk policy in recovered VMs and configure it to "OnlineALL".</li>
              </ol>
            </li>
          </ol>
        </li>
      </ol>
    </div>
  )
}
