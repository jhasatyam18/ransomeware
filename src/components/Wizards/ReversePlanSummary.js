import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import { getValue } from '../../utils/InputUtils';
import { getFilteredObject } from '../../utils/PayloadUtil';

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
    const { user, t } = this.props;
    const { values } = user;
    const drPlan = getValue('ui.reverse.drPlan', values);
    let name = '';
    let replicationInterval = '';
    let protectedSiteName = '';
    let selectedVMs = {};
    if (drPlan) {
      name = drPlan.name;
      replicationInterval = drPlan.replicationInterval;
      protectedSiteName = drPlan.protectedSite.name;
      selectedVMs = drPlan.protectedEntities.virtualMachines;
    }
    const replType = getValue('reverse.replType', values);
    const replicationUnit = 'miniutes';
    let size = 0;
    Object.keys(selectedVMs).forEach((key) => {
      selectedVMs[key].virtualDisks.forEach((disk) => {
        size += disk.size;
      });
    });
    return (
      <>
        <Card className="padding-20">
          <CardTitle>{t('Reverse Protection Plan')}</CardTitle>
          <CardBody>
            <Row>
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Name</Col>
                  <Col sm={3}>{name}</Col>
                  <Col sm={3} className="text-muted">Replication Interval</Col>
                  <Col sm={3}>
                    {replicationInterval}
                    {' '}
                    {replicationUnit}
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
                  <Col sm={3}>{`${size} GB`}</Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Replication Type</Col>
                  <Col sm={3}>{replType}</Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default (withTranslation()(ReversePlanSummary));
