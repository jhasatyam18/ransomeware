import React from 'react';
import roleList from '../assets/roles.PNG';

export default function Roles() {
  return (
    <div className="content">
      <h2>Roles</h2>
      Location: Home --> Settings --> Roles <br />
      Privileges define rights to perform action on an entity of Datamotive. Whereas the role is a set of privileges.
      Roles are assigned to the user. By default Datamotive generate following three roles.
      <ol>
        <li>Administrator : With administrator role user can perform all the available operations in the system</li>
        <li>Backupadmin   : With backupadmin role user can perform operation related to protection plan and recovery/migration</li>
        <li>Read Only     : Read-only user can view the all available views but no operation allowed. </li>
      </ol>

      <img alt="" src={roleList} />

      On Left side grid all roles are listed. Click on the role o load its associated privileges and users.

    </div>
  )
}
