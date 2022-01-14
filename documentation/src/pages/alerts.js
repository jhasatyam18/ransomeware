import React from 'react'
import eve from '../assets/alerts.PNG';
import info from '../assets/alertInfo.PNG';
import event from '../assets/alertEvent.PNG';

export default function Alerts() {
  return (
    <div className="content">
      <h2>Alerts</h2>
         Navigation --> Monitor --> Alerts
      <p>Alerts are Datamotive server generated warning messages based on the events and are tagged with the severity level they occur. </p>
      <table>
        <tr>
          <td>Information   </td>
          <td>These are events for the information </td>
        </tr>
        <tr>
          <td>Warning</td>
          <td>These are events which require taking precautionary measures </td>
        </tr>
        <tr>
          <td>Error</td>
          <td>These are events which require user attention to address the issue</td>
        </tr>
        <tr>
          <td>Critical</td>
          <td>These are events which require immediate user attention to address the issue</td>
        </tr>
      </table>

      <img alt="" src={eve} />
      <p>In Alerts, the following information is displayed – </p>
      <table>
        <tr>
          <td>Title </td>
          <td>The headline/short description for the alert generated </td>
        </tr>
        <tr>
          <td>Severity </td>
          <td>The condition at which the alerts are generated </td>
        </tr>
        <tr>
          <td>Created </td>
          <td>The date and time at which the alerts are generated </td>
        </tr>
        <tr>
          <td>Last updated </td>
          <td>The date and time at which the alert was checked by the Datamotive server </td>
        </tr>
        <tr>
          <td>Status </td>
          <td>The symbol representing the severity of the alert </td>
        </tr>
      </table>

      <p>When we click on the <b>Title or Status</b> of a particular alert a window will pop-up with a description regarding that particular alert. </p>
      It consists of the 2 tabs
      <table>
        <tr>
          <td>Info </td>
          <td>Information about the alert generated </td>
        </tr>
        <tr>
          <td>Associated Event </td>
          <td>Event associated with the generated alert </td>
        </tr>
      </table>
      The info tab consists of the following
      <img alt="" src={info} />
      <table>
        <tr>
          <td>Severity </td>
          <td>The condition at which the alerts are generated </td>
        </tr>
        <tr>
          <td>Event Type </td>
          <td>The type of event that is associated with the alert </td>
        </tr>
        <tr>
          <td>Description </td>
          <td>A short description about the event occurred </td>
        </tr>
        <tr>
          <td>Created </td>
          <td>The date and time at which the alerts are generated </td>
        </tr>
        <tr>
          <td>Updated </td>
          <td>The date and time at which the alert was checked by the Datamotive server </td>
        </tr>
        <tr>
          <td>Occurrence </td>
          <td>The frequency at which the alerts is occurred </td>
        </tr>
        <tr>
          <td>Acknowledge Message </td>
          <td>User inputs when the alert is addressed  </td>
        </tr>
      </table>
      The associated event consists of the following
      <img alt="" src={event} />
      <table>
        <tr>
          <td>Event ID </td>
          <td>The ID of the event associated with the alerts </td>
        </tr>
        <tr>
          <td>Level </td>
          <td>The level of the event occurred (Ex. Information, warning, Error, Critical) </td>
        </tr>
        <tr>
          <td>Topic </td>
          <td>The topic of the event </td>
        </tr>
        <tr>
          <td>Date </td>
          <td>The date and time when the event has occurred </td>
        </tr>
        <tr>
          <td>Event Type </td>
          <td>The type of the event occurred </td>
        </tr>
        <tr>
          <td>Description </td>
          <td>A short description about the event occurred </td>
        </tr>
      </table>
      <p>
        User can perform specific action (system generated) or just acknowledge the alert without taking any action. Certain Alerts, mandate user action to resolve the issue. Once the alert is acknowledged or action is taken by the system, the status of the Alert changes.
      </p>
    </div>
  )
}
