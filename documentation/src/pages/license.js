import React from 'react'
import licList from '../assets/license.PNG';
import licInit from '../assets/liceInstallInit.PNG';
import licAbout from '../assets/licAbout.PNG';
import licValidated from '../assets/licenseValidated.PNG';
import licenseList from '../assets/licenseList.PNG';

export default function License() {
  return (
    <div className="content">
      <h2>License</h2>
      Location: Home --> Settings --> License
      <p>License is required to perform the recovery and migrations operations. By default, system will provide a trial license which has a minimum number of migrations and recoveries were allowed.
        <br />Once you perform any migration or recovery operation the respective consumption will reflect in its associated consumption bar. </p>
      <img alt="" src={licList} />
      <div>
        <h4>License installation</h4>
        For new license installation, contact the support@datamotive.io with following information.
        <ol>
          <li><b>Node Key:</b> You can get node key through the about section of the application. </li>
          <img alt="" src={licAbout} />
          <li>Along with node key provide the details requested by the support team. </li>
          <li><p>
            On successful credential validation Datamotive team will provide you a license file. 
            Once you receive the license form the Datamotive team, navigate to the settings --> license
            Click on <b>+New</b> button to install the received license. A new modal window will popup.
          </p></li>
          <img alt="" src={licInit} />
          <li>Click on the upload icon to select the license file. </li>
          <li>Post successful validation the detail of the license is shown.  </li>
          <img alt="" src={licValidated} />
          <li>If all the license details look good, then click install.  </li>
          <li>New license will get install in the system. </li>
          <img alt="" src={licenseList} />
          <p>If multiple license available in the system, click on the action button to active or deactivate the license</p>
        </ol>
      </div>
    </div>
  )
}
