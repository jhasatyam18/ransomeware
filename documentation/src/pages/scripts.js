import React from 'react';
import scriptsList from '../assets/scriptsList.PNG';
import scriptsNew from '../assets/scriptsNew.PNG';
import scriptsActions from '../assets/scriptsActions.PNG';
import scriptInput from '../assets/scriptInput.PNG';

export default function Scripts() {
  return (
    <div className="content">
      <h2>Scripts</h2>

        Location: Home --> Settings --> Scripts <br />
      <p>Datamotive supports executing custom scripts on recovery of individual virtual machine and complete protection plan as well. Datamotive supports both, Pre & Post scripts. The scripts are executed on the Datamotive management node.</p>
      <img src={scriptsList} />

      To configure new script, follow below steps.
      <ul>
        <li>Click on the +New button, new popup will be shown to configure script. </li>
        <img alt="" src={scriptsNew} />
        <li>Select the script file for the upload</li>
        <li>
          Select Pre or Post script type
          <div className="grid-key-value">
            <div className="key">Pre</div>
            <div className="value"><p>Script will run before Datamotive executes recovery workflow for a VM when configured as a VM pre-script and before recovery of protection plan when configured as Protection Plan pre-script. Typically, this script should take care of infrastructure configurations required for the virtual machine to come up. E.g. configuring firewall rules for this VM, creating domains for authentication etc.</p></div>
          </div>
          <div className="grid-key-value">
            <div className="key">Post</div>
            <div className="value"><p>Script will run after the entity is recovered when configured as VM post-script and after Protection Plan recovery when configured as Protection Plan post-script. Typically, this script should take care of recovered entity specific configurations. E.g. Configuring application properties with new internal IPs etc.</p> </div>
          </div>
          <div className="grid-key-value">
            <div className='key'>Scripts Input:</div>
            <div className='value'>
              <p>
                Currently, Datamotive supports only shell scripts for execution. In future, binding for different languages will be provided. On invocation the script is provided with following parameters in the order.
              </p>
              <ul>
                <li>Pre-script: None</li>
                <li>Post-script: JSON string with following format
                  <img alt="" src={scriptInput} />
                </li>
              </ul>
            </div>
          </div>
          <div className="grid-key-value">
            <div className='key'>Scripts Output:</div>
            <div className='value'>
              <p>
                The scripts are checked for it's completion and the process exit status is captured. If there are no errors in executing the script, Datamotive considers it to be successfully executed. If there are errors, the recovery is marked as Partially Completed.
              </p>
            </div>
          </div>
        </li>
        <li>Provide some short description about the script (optional)</li>
        <li>Enter logged in user password and click <b>Save button</b></li>
        <li>Post successful validation script will get uploaded and can be used in protection plan for pre or post script</li>
        <img src={scriptsActions} />
      </ul>
      <ul>
        Following actions are available for a uploaded script.
        <li><b>Edit :</b> Click on edit icon to edit script.</li>
        <li><b>Remove :</b> Click on remove icon to remove script.</li>
      </ul>

    </div>
  )
}
