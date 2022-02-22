import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Form } from 'reactstrap';
import DMField from '../Shared/DMField';

class RecoveryConfig extends Component {
  render() {
    const { user, dispatch, t } = this.props;
    return (
      <>
        <Card className="padding-20">
          <CardTitle>{t('Tools Installation')}</CardTitle>
          <CardBody>
            <Form style={{ width: '100%' }}>
              <DMField dispatch={dispatch} user={user} fieldKey="recovery.installSystemAgent" />
              <DMField dispatch={dispatch} user={user} fieldKey="recovery.installCloudPkg" />
            </Form>
          </CardBody>
        </Card>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(RecoveryConfig));
