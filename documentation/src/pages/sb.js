import React from 'react';
import sbl from '../assets/techSupport.PNG';
import sbG from '../assets/techSupportGenerate.PNG';

export default function SupportBundle() {
  return (
    <div className="content">
      <h2>Tech Support</h2>

        Location: Home --> Settings --> Tech Support <br />
      Support bundle is useful to triage the any issue occurred in the system.

      <img src={sbl} />
      To collect new support bundle, follow below steps.
      <ul>
        <li>Click on the +Generate button, new popup will be shown to trigger bundle creation. </li>
        <img src={sbG} />
        <li>Provide a proper description specifying why new support bundle generation is requested and click <b>Generate Bundle </b></li>
        <li>Post system accepts the generate bundle request it will collect all the required info from the node.  </li>
        <li>Note: This operation may take several minutes complete, you can check the status of bundle in the list. (Click Refresh to update the status) </li>
        <li>Once support bundle generation completed, in the action section you will get a download icon. </li>
        <li>Use Download icon to download the support bundle</li>
        <li>Use delete icon to remove the support bundle from the system  </li>
      </ul>
    </div>
  )
}
