import React from 'react'

export default function SupportMatrix() {
  const supportedOSVersions = [
    { name: 'CentOS 6 ', kernel: '', supported: false }, { name: 'CentOS 7.9', kernel: ['3.10.0-1160.el7.x86_64'], supported: true },
    { name: 'CentOS 8 ', kernel: '', supported: false }, { name: ['Red Hat Enterprise Linux 6'], kernel: '', supported: false },
    { name: 'Red Hat Enterprise Linux 7.9', kernel: ['3.10.0-1160.el7.x86_64'], supported: true },
    { name: 'Red Hat Enterprise Linux 8 ', kernel: '', supported: false },
    { name: 'Ubuntu 14 ', kernel: ['4.4.0-148-generic'], supported: true },
    { name: 'Ubuntu 16 ', kernel: ['4.15.0-45-generic', '4.15.0-142-generic', '4.10.0-28-generic'], supported: true },
    { name: 'Ubuntu 18 ', kernel: ['5.4.0-42-generic', '5.4.0-72-generic', '5.4.0-91-generic'], supported: true },
    { name: 'Ubuntu 20', kernel: ['5.11.0-27-generic'], supported: true },
    { name: 'Oracle Linux 6', kernel: '', supported: false },
    { name: 'Oracle Linux 7', kernel: '', supported: false },
    { name: 'Oracle Linux 8', kernel: '', supported: false },
    { name: 'Debian 9 ', kernel: '', supported: false },
    { name: 'Debian 10 ', kernel: '', supported: false },
    { name: 'Suse Linux 12', kernel: '', supported: false },
    { name: 'Suse Linux 15', kernel: '', supported: false },
    { name: 'Microsoft Windows 10 Professional', kernel: '', supported: true },
    { name: 'MS Windows Server 2012 (Standard, Datacenter)', kernel: '', supported: true },
    { name: 'MS Windows Server 2012 R2 (Standard, Datacenter)', kernel: '', supported: true },
    { name: 'MS Windows Server 2016 (Standard, Datacenter)', kernel: '', supported: true },
    { name: 'MS Windows Server 2019 (Standard, Datacenter) ', kernel: '', supported: true },
  ];

  const vmWareSupportMatrix = [
    { version: 'vCenter Server 5.5', supported: false },
    { version: 'vCenter Server 6.0', supported: false },
    { version: 'vCenter Server 6.5 (U1, U2) ', supported: false },
    { version: 'vCenter Server 6.5 (U3)', supported: true },
    { version: 'vCenter Server 6.7 ', supported: true },
    { version: 'vCenter Server 6.7 (U1, U2, U3) ', supported: true },
    { version: 'Center Server 7.0 ', supported: true },
    { version: 'ESXi 5.5  ', supported: false },
    { version: 'ESXi 6.0  ', supported: false },
    { version: 'ESXi 6.5 (GA, U1, U2)', supported: false },
    { version: 'ESXi 6.5 (U3) ', supported: true },
    { version: 'ESXi 7.0 (GA) ', supported: false },
  ];

  const renderOSSupportMatrix = () => {
    return (
      <>
        <h4>Guest OS</h4>
        <table>
          <tr>
            <td><b>Operating System</b></td>
            <td><b>Kernel</b></td>
            <td></td>
          </tr>
          {
            supportedOSVersions.map((os) => {

              return (
                <tr>
                  <td>{os.name}</td>
                  <td>{(os.kernel !== '' && os.kernel.length > 0 ? os.kernel.join(',') : '')}</td>
                  <td> <input type="checkbox" checked={os.supported} /> </td>
                </tr>
              );
            })
          }
        </table>
      </>
    );
  };
  const renderVMwareSupportMatrix = () => {
    return (
      <>
        <h4>VMware</h4>
        <table>
          {
            vmWareSupportMatrix.map((os) => {
              return (
                <tr>
                  <td>{os.version}</td>
                  <td> <input type="checkbox" checked={os.supported} /> </td>
                </tr>
              );
            })
          }
        </table>
      </>
    );
  };
  const renderCloudMatrix = () => {
    return (
      <>
        <h4>Cloud Providers</h4>
        <table>
          <tr>
            <td> AWS (Amazon Web Services)</td>
            <td> <input type="checkbox" checked="true" /> </td>
          </tr>
          <tr>
            <td> Google Cloud</td>
            <td> <input type="checkbox" checked="true" /> </td>
          </tr>
        </table>
      </>
    );
  };

  return (
    <div class="content">
      <h2>Support Matrix</h2>
      <p>Datamotive Workload Mobility provides the following key capabilities:</p>
      {renderVMwareSupportMatrix()}
      {renderCloudMatrix()}
      {renderOSSupportMatrix()}
    </div>
  )
}
