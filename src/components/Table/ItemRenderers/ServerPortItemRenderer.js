import React from 'react';

function ServerPortItemRenderer({ data }) {
  const mgmtPort = data.managementPort;
  const replCtrlPort = data.replicationCtrlPort;
  const replDataPort = data.replicationDataPort;
  let replPort = 0;
  if (replCtrlPort !== 0 && replDataPort !== 0) {
    replPort = `${replCtrlPort}, ${replDataPort}`;
  } else if (replCtrlPort !== 0) {
    replPort = replCtrlPort;
  }
  function getPort(icon, title, value) {
    return (
      <i className={icon} title={title}>
        &nbsp;
        &nbsp;
        {value}
        &nbsp;
        &nbsp;
      </i>
    );
  }
  return (
    <>
      <div>
        {mgmtPort !== 0 ? getPort('fas fa-user', 'Management', mgmtPort) : ''}
        {replPort !== 0 ? getPort('far fa-clone', 'Replication', replPort) : ''}
      </div>
    </>
  );
}

export default ServerPortItemRenderer;
