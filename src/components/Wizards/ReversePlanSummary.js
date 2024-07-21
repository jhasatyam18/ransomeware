import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import { getValue } from '../../utils/InputUtils';
import { convertMinutesToDaysHourFormat, getStorageWithUnit } from '../../utils/AppUtils';
import { getFilteredObject } from '../../utils/PayloadUtil';
import { REVERSE_SUMMARY_ENTITY_TYPE_RENDERER, TABLE_REVERSE_VM } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';

class ReversePlanSummary extends Component {
  getRecoverySiteName() {
    const { user } = this.props;
    const { values } = user;
    const sites = getValue('ui.values.sites', values);
    let recoverySiteName = '';
    if (sites) {
      const SelectedRSite = getValue('reverse.recoverySite', values);
      const rSite = sites.filter((site) => getFilteredObject(site, SelectedRSite, 'id'))[0];
      recoverySiteName = rSite.name;
    }
    return recoverySiteName;
  }

  render() {
    const { user, t, dispatch } = this.props;
    const { values } = user;
    const drPlan = getValue('ui.reverse.drPlan', values);
    let name = '';
    let replicationInterval = '';
    let protectedSiteName = '';
    let selectedVMs = {};
    const col = TABLE_REVERSE_VM.filter((_, index) => index !== 4).map((el) => ({ ...el }));
    col.push({ label: 'Recovery Entity Type', field: 'virtualDisks', itemRenderer: REVERSE_SUMMARY_ENTITY_TYPE_RENDERER, width: 3 });
    if (drPlan) {
      name = drPlan.name;
      replicationInterval = convertMinutesToDaysHourFormat(drPlan.replicationInterval);
      protectedSiteName = drPlan.protectedSite.name;
      selectedVMs = drPlan.protectedEntities.virtualMachines;
    }
    let size = 0;
    Object.keys(selectedVMs).forEach((key) => {
      selectedVMs[key].virtualDisks.forEach((disk) => {
        if (typeof disk.isDeleted !== 'undefined' && !disk.isDeleted && typeof disk.size !== 'undefined') {
          size += disk.size;
        }
      });
    });
    const updateVMs = selectedVMs.map((el) => ({ ...el, replicationType: el.isDifferential ? 'Differential' : 'Full' }));
    selectedVMs = [...updateVMs];
    size = getStorageWithUnit(size);
    return (
      <>
        <Card className="padding-20">
          <CardTitle>{t('Reverse Protection Plan')}</CardTitle>
          <CardBody>
            <Row className="pl-2">
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Name</Col>
                  <Col sm={3}>{name}</Col>
                  <Col sm={3} className="text-muted">Replication Interval</Col>
                  <Col sm={3}>
                    {replicationInterval}
                  </Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Protected Site</Col>
                  <Col sm={3}>{protectedSiteName}</Col>
                  <Col sm={3} className="text-muted">Recover Site</Col>
                  <Col sm={3}>{this.getRecoverySiteName()}</Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Virtual Machines</Col>
                  <Col sm={3}>{Object.keys(selectedVMs).length}</Col>
                  <Col sm={3} className="text-muted">Total Storage</Col>
                  <Col sm={3}>{size}</Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
            </Row>
          </CardBody>
          <DMTable
            dispatch={dispatch}
            columns={col}
            data={selectedVMs}
            primaryKey="moref"
            user={user}
          />
        </Card>
      </>
    );
  }
}

export default (withTranslation()(ReversePlanSummary));
