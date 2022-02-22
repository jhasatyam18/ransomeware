import React from 'react';
import emailConfig from '../assets/emailConfig.PNG';
import emailPostConfig from '../assets/emailPostConfig.PNG';
import emailRecipient from '../assets/emailRecipient.PNG';


export default function Email() {
  return (
    <div className="content">
      <h2>Email</h2>
        Location: Home --> Settings --> Email
      <p>Email setting allow you to configure the email and recipients details so that Datamotive can send you the critical alerts details over the email. </p>
      <b>Configuration</b>
      <ul>
        <li>Click on the <b>Configure Now</b> to open email configuration window. </li>
        <li>Provide the required details and click Configure.  </li>
        <img alt="" src={emailConfig} />
        <table>
          <tr>
            <td>Email Address </td>
            <td>Email address used to send the communication alerts. </td>
          </tr>
          <tr>
            <td>Email Password  </td>
            <td>Email Password for the authentication.

              Note: System will encrypt these details before saving them in the database. </td>
          </tr>
          <tr>
            <td>SMTP Host  </td>
            <td>SMTP hostname or SMTP server IP address </td>
          </tr>
          <tr>
            <td>SMTP Port  </td>
            <td>SMTP port number </td>
          </tr>
          <tr>
            <td>SSL Certificate Verification  </td>
            <td>Click if your smtp server is secure and SSL certificate is installed on it. </td>
          </tr>
          <tr>
            <td>Replicate Configuration </td>
            <td>If multiple sites were already connected to the node from where you are configuring the email and you want same settings should get replicate on all the connected sites, then enable this option. </td>
          </tr>
        </table>
        <li>Post email Configuration you can view the configured details along with Email Recipients section get enabled. </li>
        <img alt="" src={emailPostConfig} />
        <li>To add new recipient, click on +New button </li>
        <img alt="" src={emailRecipient} />
        <li>Provide email address of the recipient </li>
        <li>Select the events for which you want to send email to recipients. </li>
        <li>Click configure to add new recipient in the email list for subscribed events.  </li>
      </ul>
    </div>
  )
}
