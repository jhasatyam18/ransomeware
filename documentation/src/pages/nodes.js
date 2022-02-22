import React from 'react';
import nodeConfigure from '../assets/configureNode.PNG';
import newNode from '../assets/newNode.PNG';
import nodeConfig from '../assets/nodeConfig.PNG';
import nodeList from '../assets/nodeList.PNG';

export default function Nodes() {
  return (
    <div className="content">
      <h2>Nodes</h2>
      <p>Nodes are entities where the Datamotive server is installed (Ex. AWS, GCP, VMWare, etc.). Datamotive Nodes are of different types wiz Management, Replication, Dedup & Win Prep. Each node has specific functionality.</p>
      <ol>
        <li><b>Management:</b> Node for performing Datamotive management operations. There must be one and only Management node for each site.</li>
        <li><b>Replication:</b> Nodes responsible for performing replication activities. These can be added based on number of Virtual Machine disks to be replicated in parallel. Any number of nodes can be added to meet the requirement. </li>
        <li><b>Dedup:</b> This is a special type of node required to support deduplication. This node is required only on the Recovery site. </li>
        <li><b>Win Prep:</b> This is also a special type of node required only on Recovery site to perform Windows workloads recovery.</li>
      </ol>
      <p>
        For all the nodes, Datamotive provides separate OVAs & cloud specific machine images. Once Node of given type is deployed in the infrastructure, it needs to be added in the Datamotive Management server. Nodes have to be deployed and configured in following manner.
      </p>
      <ol>
        <li><b>Management Node:</b> Deploy 1 management node per protected site. Local node representing the management node automatically gets registered. </li>
        <li><b>Remote Management Node:</b> Deploy 1 management node per recovery site. Register the management nodes from Recovery Sites in Management Node of Protected Site.</li>
        <li><b>Replication Nodes:</b> Deploy replication node based on load. Once deployed register replication node in the local management server. Replication nodes are always added to local management node only. </li>
        <li><b>Dedup Node:</b> Deploy the Dedup node on Recovery Site. Once deployed, register the Dedup node with Management Node on the Recovery Site.</li>
        <li><b>Win Prep Node:</b> Deploy the Win Prep node on Recovery Site. Once deployed, register the Win Prep node with Management Node on the Recovery Site.</li>
      </ol>
      {/* <img alt="" src={nodeImg} /> */}
      <p>
         To Access Node option, Go to Configure -> Nodes (Note- By default the Local node will be configured.)
        To add new node -
        Click On “+ New” option as shown below -
      </p>

      <img alt="" src={nodeConfigure} />

      <p>It consists of the below options-</p>

      <table>
        <tr>
          <td><b>Name </b></td>
          <td>The desired name to identification </td>
        </tr>
        <tr>
          <td><b>Hostname   </b></td>
          <td>This is FQDN or IP address of the server </td>
        </tr>
        <tr>
          <td><b>Username   </b></td>
          <td>This is the username of the Datamotive Engine.</td>
        </tr>
        <tr>
          <td><b>Password  </b></td>
          <td>This is the password of the Datamotive Engine </td>
        </tr>
        <tr>
          <td><b>Type  </b></td>
          <td>Type of node. Node can be one of the following types

            <ul>
              <li><b>Management :</b> Used when you would want to manage the servers (Edit, remove, and modify, etc)  </li>
              <li><b>Replication  :</b> Used when you would want to replicate the servers to the target site   </li>
              <li><b>Prep Node  :</b> Datamotive windows node  </li>
              <li><b>Dedupe Server  :</b> dedupelication server node  </li>
            </ul>
          </td>
        </tr>
      </table>
      <img alt="" src={newNode} />
      <p><b>(Note – Based on the selection of Type, further details need to be entered). Ex. In option, the management type is selected. It consists of the below options -</b> </p>
      <table>
        <tr>
          <td><b>Platform Type</b></td>
          <td>Platform where the node is deployed</td>
        </tr>
        <tr>
          <td><b>Management port </b></td>
          <td>Port on which the management service runs (By default, it 5000) </td>
        </tr>
        <tr>
          <td><b>Replication Data Port  </b></td>
          <td>Port on which the replication data service runs (By default, it 5001) .</td>
        </tr>
        <tr>
          <td><b>Replication Controller Port </b></td>
          <td>Port on which the replication controller service runs (By default, it 5003) </td>
        </tr>
        <tr>
          <td><b>Encryption Key </b></td>
          <td>Data will be encrypted using this key while transferring from one node to another node.</td>
        </tr>
      </table>
      <p>Click on configure to create <b>Node</b> and on successful creation, node will be listed in the below list view.
        <img alt="" src={nodeConfig} />
        <img alt="" src={nodeList} />
      </p>

    </div>
  )
}
