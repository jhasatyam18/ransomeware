import React from 'react'
import vmwareCS from '../assets/vmwareCS.PNG';
import delSite from '../assets/delSite.PNG';
export default function SiteActions() {
  return (
    <div className="content">
      <h2>Site Actions</h2>

      <b>Navigation:</b> Home &gt; Configuration &gt; Sites
      <p>Following two operations were allowed on the configured site</p>
      <ol>
        <li>Edit Site</li>
        <li>Remove Site</li>
      </ol>

      <h4>Edit Site</h4>
      <p>Select site from list for reconfiguration .<br />
        To Edit a site, click on <b>Edit</b> button and then Edit windows will pop-up.<br />
        modify the input which need to be changed and click on configure to save the configuration.
        <img src={vmwareCS} />
      </p>


      <h4>Remove Site</h4>
      <p>Select site from list for removal .<br />
        To remove a site, click on <b>Remove</b> a confirmation modal will pop-up.<br />
        On click of confirm, the selected site will be deleted.
        <img src={delSite} />
      </p>
    </div>
  )
}
