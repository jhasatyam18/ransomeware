import React, { Component } from 'react';

import { Card, CardBody, Badge, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

class NodeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [
        {
          id: '72.117.30.68',
          name: 'DM_VMware_CA',
          deployedOn: 'VMware_CA',
          vms: '15',
          status: 'success',
          usage: '3',
          state: 'Online',
          type: 'Protect',
        },
        {
          id: '34.168.40.56',
          name: 'DM_AWS_EU',
          deployedOn: 'AWS_EU (London)',
          vms: '8',
          status: 'success',
          usage: '1.5',
          state: 'Online',
          type: 'Protect/Recovery',
        },
        {
          id: '34.189.60.52',
          name: 'DM_GCP_US',
          deployedOn: 'GCP_US_WEST',
          vms: '4',
          status: 'success',
          usage: '0.4',
          state: 'Online',
          type: 'Recovery',
        },
        {
          id: '20.218.60.22',
          name: 'DM_VMware_UK',
          deployedOn: 'VMware_UK',
          vms: '12',
          status: 'success',
          usage: '2',
          state: 'Online',
          type: 'Protect',
        },
      ],
    };
  }

  render() {
    const { nodes } = this.state;
    return (
      <>
        <Card>
          <CardBody>
            <Row>
              <Col sm={9}>
                <p className="font-weight-medium dashboard-title">Replication Nodes (4)</p>
              </Col>
              <Col sm={3}>
                <div className="dashboard_replication_header_state">
                  Overall State &nbsp;&nbsp;
                  <Badge className="font-size-12 badge-soft-success" color="success" pill>
                    Healthy
                  </Badge>
                </div>
              </Col>
            </Row>
            <div className="table-responsive">
              <table className="table table-centered table-nowrap mb-0">
                <thead className="thead-light">
                  <tr>
                    <th>Node</th>
                    <th>Type</th>
                    <th>Deployed On</th>
                    <th>IP Address</th>
                    <th>VMs</th>
                    <th>Usage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node, key) => (
                    <tr key={`tr---${key * 2}`}>
                      <td>{node.name}</td>
                      <td>{node.type}</td>
                      <td>{node.deployedOn}</td>
                      <td>
                        <Link to="#" className="text-body font-weight-bold">
                          {' '}
                          {node.id}
                          {' '}
                        </Link>
                        {' '}
                      </td>
                      <td>{node.vms}</td>
                      <td>{`${node.usage} GB`}</td>
                      <td>
                        <Badge className={`font-size-12 badge-soft-${node.status}`} color={node.status} pill>
                          {node.state}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default NodeInfo;
