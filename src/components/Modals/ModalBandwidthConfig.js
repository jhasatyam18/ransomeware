import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CardBody, Col, Row } from 'reactstrap';
import DMField from '../Shared/DMField';
import DMToolTip from '../Shared/DMToolTip';
import { addMessage } from '../../store/actions/MessageActions';
import { closeModal } from '../../store/actions/ModalActions';
import { configureBandwidth } from '../../store/actions/ThrottlingAction';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { getValue } from '../../utils/InputUtils';
import { getBandwidthPayload } from '../../utils/PayloadUtil';

class ModalBandwidthConfig extends Component {
  constructor() {
    super();
    this.onClose = this.onClose.bind(this);
    this.onConfigureBandwidth = this.onConfigureBandwidth.bind(this);
  }

  onClose() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  onConfigureBandwidth() {
    const { user, dispatch, options } = this.props;
    const { id } = options;
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
    payload.throttling.id = id;
    dispatch(configureBandwidth({ ...payload.throttling }));
  }

  renderFooter() {
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={this.onClose}>Close </button>
        <button type="button" className="btn btn-success" onClick={this.onConfigureBandwidth}> Configure </button>
      </div>
    );
  }

  renderForm() {
    const { dispatch, t, user } = this.props;
    const { values } = user;
    const limitDisabled = !getValue('throttling.isLimitEnabled', values);
    const timeDisabled = !getValue('throttling.isTimeEnabled', values);
    return (
      <CardBody className="modal-card-body">
        <div className="flex__form_horizontal">
          <div className="form__item">
            <div className="form__label">
              {t('throttling.isLimitEnabled')}
            </div>
            <div className="form__input">
              <Row>
                <Col sm={2}>
                  <DMField dispatch={dispatch} user={user} fieldKey="throttling.isLimitEnabled" hideLabel="true" />
                </Col>
                <Col sm={8}>
                  <DMField dispatch={dispatch} user={user} fieldKey="throttling.bandwidthLimit" disabled={limitDisabled} hideLabel="true" />
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
                  <DMField dispatch={dispatch} user={user} fieldKey="throttling.isTimeEnabled" hideLabel="true" />
                </Col>
                <Col sm={8}>
                  <DMField dispatch={dispatch} user={user} fieldKey="throttling.timeLimit" disabled={timeDisabled} hideLabel="true" />
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
                  <DMField dispatch={dispatch} user={user} fieldKey="throttling.startTime" disabled={timeDisabled} hideLabel="true" />
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
                  <DMField dispatch={dispatch} user={user} fieldKey="throttling.endTime" disabled={timeDisabled} hideLabel="true" />
                </Col>
                <Col sm={2}>
                  <DMToolTip tooltip="info.throttling.time.limit.end" />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </CardBody>
    );
  }

  render() {
    return (
      <>
        <div className="modal-body noPadding">
          {this.renderForm()}
        </div>
        {this.renderFooter()}
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ModalBandwidthConfig));
