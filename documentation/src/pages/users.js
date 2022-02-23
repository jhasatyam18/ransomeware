import React from 'react';
import userList from '../assets/userList.PNG';

export default function Users() {
  return (
    <div className="content">
      <h2>Users</h2>

        Location: Home --> Settings --> Users <br />
        Users list  provide all registered users with their assign roles.
        <img alt="" src={userList} />
    </div>
  )
}
