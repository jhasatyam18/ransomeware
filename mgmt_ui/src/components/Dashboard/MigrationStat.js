import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';

class MigrationStat extends Component {
  render() {
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">Migration statistics</p>
            <div className="table-responsive">
              <table className="table table-centered table-nowrap mb-0">
                <tbody>
                  <tr>
                    <th>Completed</th>
                    <th>10</th>
                  </tr>
                  <tr>
                    <th>In-Progress</th>
                    <th>2</th>
                  </tr>
                  <tr>
                    <th>Errors</th>
                    <th>0</th>
                  </tr>
                  <tr>
                    <th>Test Migration Completed</th>
                    <th>2</th>
                  </tr>
                  <tr>
                    <th>VMs Ready For Migration</th>
                    <th>2</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default MigrationStat;
