import React, { Component } from 'react';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { TABLE_PROTECT_VM_VMWARE } from '../../constants/TableConstants';
import { getValue } from '../../utils/InputUtils';

class RecoverySummary extends Component {
  render() {
    const { dispatch, user } = this.props;
    const { values } = user;
    const selectedVMs = getValue('ui.site.seletedVMs', values);
    const protectionplanID = getValue('recovery.protectionplanID', values);
    const selectedDrPlan = getValue('ui.values.drplan', values).filter((plan) => `${plan.id}` === `${protectionplanID}`)[0];
    const dryRun = getValue('recovery.dryrun', values);
    const data = [];
    const { name } = selectedDrPlan;
    let size = 0;
    Object.keys(selectedVMs).forEach((key) => {
      data.push(selectedVMs[key]);
      selectedVMs[key].virtualDisks.forEach((disk) => {
        size += disk.size;
      });
    });
    return (
      <>
        <Card className="padding-20">
          <CardTitle>Recovery Summary</CardTitle>
          <CardBody>
            <Row>
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Plan</Col>
                  <Col sm={3}>{name}</Col>
                  <Col sm={3} className="text-muted">Recovery Type</Col>
                  <Col sm={3}>{(dryRun ? 'TEST' : 'FULL')}</Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Virtual Machines</Col>
                  <Col sm={3}>{data.length}</Col>
                  <Col sm={3} className="text-muted">Total Size</Col>
                  <Col sm={3}>{`${size} GB`}</Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
            </Row>
            <DMTable
              dispatch={dispatch}
              columns={TABLE_PROTECT_VM_VMWARE}
              data={data}
            />
          </CardBody>
        </Card>
      </>
    );
  }
}

export default RecoverySummary;
