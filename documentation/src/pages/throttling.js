import React from 'react';
import thrt from '../assets/throttling.PNG';
import thrtEnLimit from '../assets/throttlingEnLimit.PNG';
import thrtEnTimeLimit from '../assets/throttlingEnTimeLimit.PNG';
import throttlingNode from '../assets/throttlingNode.PNG';

export default function Throttling() {
  return (
    <div className="content">
      <h2>Throttling</h2>
      Location: Home --> Settings --> Throttling  <br />
      <p>Throttling allows you the configure the network usage as per requirement. By default, system will use networks full capacity to download or upload the replication data across the sites. If you want to restrict the bandwidth, use then bandwidth throttling configuration is required. </p>
      <img alt="" src={thrt} />
      Provide the below details and click configure to apply bandwidth throttling.
      <table>
        <tr>
          <td>Enable Limit </td>
          <td>Enable the option if bandwidth throttling is required.
            Once enable you can provide the bandwidth usage details by scrolling
            <img alt="" src={thrtEnLimit} />
          </td>
        </tr>
        <tr>
          <td>Enable Time Limit, </td>
          <td>If time limit base usage configuration required, then enable the option.
            <p>Once enable you can provide the bandwidth limits along with its start and end time specification over which time base limits will be applicable.</p>
            <img alt="" src={thrtEnTimeLimit} />
          </td>
        </tr>
        <tr>
          <td>Apply To All Replication Nodes </td>
          <td>If you want to apply same setting on all the replication nodes, then enable this option</td>
        </tr>
      </table>
      <ul>
        <li>If you want to configure each replication node bandwidth throttling, then click on edit icon to configure the node specific usage limits. </li>
        <li>New popup window will be shown to configure the node specific configuration.  </li>
        <img alt="" src={throttlingNode} />
        <li>Provide the details and click configure. Provided configuration will get applied on the node. </li>
      </ul>
    </div>

  )
}
