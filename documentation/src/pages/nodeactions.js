import React from 'react'
import nodeList from '../assets/nodeList.PNG';
import nodeEdit from '../assets/nodeEdit.PNG';
import removeNode from '../assets/removeNode.PNG';

export default function Nodeactions() {
  return (
    <div className="content">
      <h2>Node Action</h2>
      <b>Navigation:</b> Home &gt; Configuration &gt; Nodes
      <p>Following two operations were allowed on the configured node</p>
      <ol>
        <li><a href="#editNode">Edit Node</a></li>
        <li><a href="#removeNode">Remove Node</a></li>
      </ol>
      <img src={nodeList} />
      <h4>Edit Node</h4>
      <p id="editNode">Select edit from list for reconfiguration .<br />
        To Edit a node, click on <b>Edit</b> button and then Edit windows will pop-up.<br />
        Modify the input which need to be changed and click on configure to save the configuration.
        <img src={nodeEdit} />
      </p>

      <h4>Remove Node</h4>
      <p id="removeNode">Select node from list for deletion .<br />
        To remove a node, click on <b>Remove</b> a confirmation modal will pop-up.<br />
        On click of confirm, the selected node will be deleted.
        <img src={removeNode} />
      </p>
    </div>
  )
}
