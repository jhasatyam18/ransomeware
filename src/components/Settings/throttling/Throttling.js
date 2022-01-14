import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { TABLE_THROTTLING_NODES } from '../../../constants/TableConstants';
import { addMessage } from '../../../store/actions/MessageActions';
import { configureBandwidth, fetchBandwidthConfig, fetchBandwidthReplNodes } from '../../../store/actions/ThrottlingAction';
import { getValue } from '../../../utils/InputUtils';
import { getBandwidthPayload } from '../../../utils/PayloadUtil';
import ActionButton from '../../Common/ActionButton';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import DMField from '../../Shared/DMField';
import DMTable from '../../Table/DMTable';
import DMToolTip from '../../Shared/DMToolTip';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';

class Throttling extends Component {
  constructor() {
    super();
    this.onConfigureBandwidth = this.onConfigureBandwidth.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchBandwidthConfig());
    dispatch(fetchBandwidthReplNodes());
  }

  onConfigureBandwidth() {
    const { user, dispatch } = this.props;
    const payload = getBandwidthPayload('throttling.', user);
    const { throttling } = payload;
    const { bandwidthLimit, endTime, isLimitEnabled, isTimeEnabled, startTime, timeLimit } = throttling;
    if (isLimitEnabled && bandwidthLimit <= 0) {
      dispatch(addMessage('Bandwidth must be greater than 0.', MESSAGE_TYPES.ERROR));
      return;
    }
    if (isTimeEnabled && (endTime === '' || startTime === '')) {
      dispatch(addMessage('Invalid start or end time value', MESSAGE_TYPES.ERROR));
      return;
    }
    if (isTimeEnabled && timeLimit <= 0) {
      dispatch(addMessage('Bandwidth must be greater than 0.', MESSAGE_TYPES.ERROR));
      return;
    }
    dispatch(configureBandwidth({ ...payload.throttling }));
    dispatch(fetchBandwidthReplNodes());
  }

  onReset() {
    const { dispatch } = this.props;
    dispatch(fetchBandwidthConfig());
  }

  renderReplNodes() {
    const { settings, dispatch, user } = this.props;
    const { replNodes } = settings;
    return (
      <Card className="padding-top-10 margin-top-10">
        <Col sm={12} className="margin-top-10 margin-left-10">
          <CardTitle className="title-color">Replication Nodes</CardTitle>
        </Col>
        <DMTable
          columns={TABLE_THROTTLING_NODES}
          data={replNodes}
          primaryKey="id"
          dispatch={dispatch}
          user={user}
        />
      </Card>
    );
  }

  renderThrottlingForm() {
    const { dispatch, t, user } = this.props;
    const { values } = user;
    const hasPrivilege = hasRequestedPrivileges(user, ['throttling.Config']);
    const limitDisabled = !getValue('throttling.isLimitEnabled', values);
    const timeDisabled = !getValue('throttling.isTimeEnabled', values);
    const applyDisabled = limitDisabled && timeDisabled;
    return (
      <div className="flex__form_horizontal">
        <div className="form__item">
          <div className="form__label">
            {t('throttling.isLimitEnabled')}
          </div>
          <div className="form__input">
            <Row>
              <Col sm={2}>
                <DMField dispatch={dispatch} user={user} fieldKey="throttling.isLimitEnabled" hideLabel="true" disabled={!hasPrivilege} />
              </Col>
              <Col sm={8}>
                <DMField dispatch={dispatch} user={user} fieldKey="throttling.bandwidthLimit" disabled={!hasPrivilege || limitDisabled} hideLabel="true" />
              </Col>
              <Col sm={2}>
                <DMToolTip tooltip="info.throttling.limit.enabled" />
              </Col>
            </Row>
          </div>
        </div>
        <div className="form__item">
          <div className="form__label">
            {t('throttling.isTimeEnabled')}
          </div>
          <div className="form__input">
            <Row>
              <Col sm={2}>
                <DMField dispatch={dispatch} user={user} fieldKey="throttling.isTimeEnabled" hideLabel="true" disabled={!hasPrivilege} />
              </Col>
              <Col sm={8}>
                <DMField dispatch={dispatch} user={user} fieldKey="throttling.timeLimit" disabled={!hasPrivilege || timeDisabled} hideLabel="true" />
              </Col>
              <Col sm={2}>
                <DMToolTip tooltip="info.throttling.time.limit.enabled" />
              </Col>
            </Row>
          </div>
        </div>
        <div className="form__item">
          <div className="form__label">
            {t('throttling.startTime')}
          </div>
          <div className="form__input">
            <Row>
              <Col sm={2}>
                {' '}
              </Col>
              <Col sm={8} className="padding-left-20">
                <DMField dispatch={dispatch} user={user} fieldKey="throttling.startTime" disabled={!hasPrivilege || timeDisabled} hideLabel="true" />
              </Col>
              <Col sm={2}>
                <DMToolTip tooltip="info.throttling.time.limit.start" />
              </Col>
            </Row>
          </div>
        </div>
        <div className="form__item">
          <div className="form__label">
            {t('throttling.endTime')}
          </div>
          <div className="form__input">
            <Row>
              <Col sm={2}>
                {' '}
              </Col>
              <Col sm={8} className="padding-left-20">
                <DMField dispatch={dispatch} user={user} fieldKey="throttling.endTime" disabled={!hasPrivilege || timeDisabled} hideLabel="true" />
              </Col>
              <Col sm={2}>
                <DMToolTip tooltip="info.throttling.time.limit.end" />
              </Col>
            </Row>
          </div>
        </div>
        <div className="form__item">
          <div className="form__label">
            {t('throttling.applyToAll')}
          </div>
          <div className="form__input">
            <Row>
              <Col sm={2}>
                {' '}
              </Col>
              <Col sm={10} className="padding-left-20">
                <DMField dispatch={dispatch} user={user} fieldKey="throttling.applyToAll" disabled={!hasPrivilege || applyDisabled} hideLabel="true" />
              </Col>
            </Row>
          </div>
        </div>
        <br />
        <div className="form__item">
          <div>
            <ActionButton label="Configure" onClick={this.onConfigureBandwidth} isDisabled={!hasPrivilege || false} t={t} key="configureBandwidth" />
            <ActionButton label="Reset" onClick={this.onReset} isDisabled={!hasPrivilege || false} t={t} key="reset" />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <>
          <Container fluid>
            <Card>
              <CardBody>
                <DMBreadCrumb links={[{ label: 'throttling', link: '#' }]} />
                {this.renderThrottlingForm()}
                {this.renderReplNodes()}
              </CardBody>
            </Card>
          </Container>
        </>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user, settings } = state;
  return { user, settings };
}
export default connect(mapStateToProps)(withTranslation()(Throttling));
