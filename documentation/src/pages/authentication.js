import React from 'react'
import auth from '../assets/auth.PNG';
import cp from '../assets/changePass.PNG';

export default function Authentication() {
  return (

    <div class="content">
      <h2>Authentication</h2>

      <p>Open the Datamotive UI through URL: https://&lt;Datamotive_Service_IP&gt;:5000</p>
      <br />
      <od>
        <li>Provide the username and password and press Login</li>
        <li>On successful login, User will see the Datamotive Dashboard. </li>
      </od>
      <br />
      <img alt="" src={auth} />
      <br />
      <p>
        <ol>
          Note:
          <li class="item1">By default Datamotive will create following three users
            <ol>
              <li>Administrator</li>
              <li>Backupadmin</li>
              <li>guest</li>
            </ol>
            <li>Default password for all the user is 'admin'</li>
          </li>
          <li class="item1">If you are login first time then for security reasons password change is must</li>
        </ol></p>
      <img alt="" src={cp} />
      <br />
      <br />
      <od>
        <li>Provide the current password and new password. </li>
        <li>Click on change password button to set new password for the system.</li>
      </od>
      <br />
      <br />
    </div>
  )
}
