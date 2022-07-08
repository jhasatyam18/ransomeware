import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { TABLE_PROTECT_VM_VMWARE } from '../../constants/TableConstants';
import { getValue } from '../../utils/InputUtils';

function TestRecoveryCleanupSummary(props) {
  function render() {
    const { dispatch, user, t } = props;
    const { values } = user;
    const selectedVMs = getValue('ui.site.seletedVMs', values);
    const data = [];
    Object.keys(selectedVMs).forEach((key) => {
      data.push(selectedVMs[key]);
    });
    return (
      <>
        <Card className="padding-20">
          <CardBody>
            <Row>
              <Col sm={12} className="text-warning">
                {t('info.test.recovery.cleanup')}
                <hr className="mt-3 mb-3" />
              </Col>
            </Row>
          </CardBody>
          <DMTable
            dispatch={dispatch}
            columns={TABLE_PROTECT_VM_VMWARE}
            data={data}
          />
        </Card>
      </>
    );
  }

  return render();
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(TestRecoveryCleanupSummary));
