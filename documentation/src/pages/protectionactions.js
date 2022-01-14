import React from 'react'
import ppListAction from '../assets/ppListAction.PNG';
import actionSource from '../assets/ppDetailActionSource.PNG';
import actiontarget from '../assets/ppDetailActionTarget.PNG';
export default function ProtectionActions() {
  return (
    <div className="content">
      <h2>Protection Plan Actions</h2>
      <b>Navigation:</b> Home &gt; Configuration &gt; Protection Plans

      <p>
        Action on protection plan is available through the protection plan list and through the protection plan details page.
        Action will get enable depending upon the context and state of the protection plan.
      </p>

      <p>Actions available through the protection plan data grid view. </p>
      <img alt="" src={ppListAction} style={{ width: "50%", height: "50%" }} />

      <p>Actions available through the protection plan details </p>
      <div className="grid-key-value">
        <div>Actions for source Site</div>
        <div>Actions for target Site</div>
      </div>
      <div className="grid-key-value">
        <div style={{ paddingRight: '20px' }}><img alt="" src={actionSource} /></div>
        <div style={{ paddingLeft: '20px' }}><img alt="" src={actiontarget} /></div>
      </div>
      <p><b>New</b>: Click to configure new protection plan. </p>
      <p>
        <b>Edit</b>:  Select protection plan from the list and click edit. Edit protection plan wizard will get open.
        In edit protection following operations were allowed
      </p>

      <ul>
        <li class="item1">Add new virtual machine to plan.</li>
        <li class="item2">Remove protected virtual machine from the plan. This action gets completed on next successful iteration of the protection plan. The VM shows as “Removing” till that time.</li>
        <li class="item3">Recovery configuration modification.</li>
        <li class="item4">Boot order configuration & modification.</li>
        <li class="item5">Replication configuration</li>
        <li class="item6">Scripts modification.</li>
      </ul>


      <p><b>Start</b>: To on start button to start replication for the selected protection plan. </p>

      <p><b>Stop</b>: To stop the protection plan replication, click on Stop button. </p>

      <p><b>Remove</b>: To remove the protection plan, click on the Remove button and it will ask for the confirmation. On confirm, the protection plan will get deleted. Note protection plan should be in stopped state and no running jobs </p>
    </div>
  )
}
