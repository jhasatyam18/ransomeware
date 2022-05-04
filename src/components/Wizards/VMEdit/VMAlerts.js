import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import DMTable from '../../Table/DMTable';
import { TABLE_ALERTS } from '../../../constants/TableConstants';
import { getValue } from '../../../utils/InputUtils';

function VMAlerts(props) {
  const { t, user, dispatch } = props;
  const { values } = user;
  const fields = ['title', 'severity', 'updatedTime'];
  const cols = TABLE_ALERTS.filter((c) => fields.indexOf(c.field) !== -1);
  const alerts = getValue('ui.vm.alerts', values);

  return (
    <Container sm={12} className="text-warning padding-top-10">
      <Row>
        <Col sm={12}>
          <div>{t('vm.alerts.warning')}</div>
          <DMTable
            dispatch={dispatch}
            columns={cols}
            data={alerts}
            primaryKey="id"
          />
        </Col>
      </Row>
    </Container>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(VMAlerts));
