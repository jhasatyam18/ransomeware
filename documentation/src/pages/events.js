import React from 'react'
import eve from '../assets/events.PNG';

export default function Events() {
  return (
    <div className="content">
      <h2>Events</h2>
      Navigation --> Monitor --> Events
      <p>Events are Datamotive server or user generated incidents which are generated automatically when they occur. </p>
      <div>
        There are 4 types of Events
        <table>
          <tr>
            <td>Information </td>
            <td>This are events occurred just for the information  </td>
          </tr>
          <tr>
            <td>Warning </td>
            <td>This are events occurred to take precautionary action  </td>
          </tr>
          <tr>
            <td>Error</td>
            <td>This are events occurred when there is an issue and needs to be addressed</td>
          </tr>
          <tr>
            <td>Critical</td>
            <td>This are events occurred when there is an issue and that needs to be addressed at the earliest</td>
          </tr>
        </table>
      </div>
      <p>To see “Events”, go to “Monitor” option and click on “Events” </p>
      <img src={eve} />
      <p>In events, the following information is displayed – </p>
      <table>
        <tr>
          <td>Date </td>
          <td>The date and time when the event has occurred </td>
        </tr>
        <tr>
          <td>Topic </td>
          <td>The topic of the event </td>
        </tr>
        <tr>
          <td>Level </td>
          <td>The level of the event occurred (Ex. Information, warning, Error, Critical) </td>
        </tr>
        <tr>
          <td>Event type </td>
          <td>the type of the event occurred </td>
        </tr>
        <tr>
          <td>Description </td>
          <td>A short description about the event occurred </td>
        </tr>
        <tr>
          <td>User</td>
          <td>User who initiated the event </td>
        </tr>
      </table>
    </div>
  )
}
