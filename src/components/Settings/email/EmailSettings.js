import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { MODAL_EMAIL_CONFIGURATION, MODAL_EMAIL_RECIPIENTS_CONFIGURATION } from '../../../constants/Modalconstant';
import { TABLE_EMAIL_RECIPIENTS } from '../../../constants/TableConstants';
import { clearValues, valueChange } from '../../../store/actions';
import { fetchEmailConfig, fetchEmailRecipients } from '../../../store/actions/EmailActions';
import { openModal } from '../../../store/actions/ModalActions';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';
import ActionButton from '../../Common/ActionButton';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import DMTable from '../../Table/DMTable';

class EmailSettings extends Component {
  constructor() {
    super();
    this.onConfigureEmail = this.onConfigureEmail.bind(this);
    this.onReconfigureEmail = this.onReconfigureEmail.bind(this);
    this.onConfigureRecipient = this.onConfigureRecipient.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchEmailConfig());
    dispatch(fetchEmailRecipients());
  }

  onConfigureEmail() {
    const { dispatch } = this.props;
    const options = { title: 'Configure Email Settings', email: null, isUpdate: false };
    dispatch(clearValues());
    dispatch(openModal(MODAL_EMAIL_CONFIGURATION, options));
  }

  onReconfigureEmail() {
    const { dispatch, settings } = this.props;
    const { email } = settings;
    const options = { title: 'Configure Email Settings', email, isUpdate: true, id: email.ID };
    Object.keys(email).forEach((key) => {
      dispatch(valueChange(`emailConfiguration.${key}`, email[key]));
    });
    dispatch(openModal(MODAL_EMAIL_CONFIGURATION, options));
  }

  onConfigureRecipient() {
    const { dispatch } = this.props;
    const options = { title: 'Email Recipient', config: null, isUpdate: false };
    dispatch(clearValues());
    dispatch(openModal(MODAL_EMAIL_RECIPIENTS_CONFIGURATION, options));
  }

  renderRecipients() {
    const { settings, t, dispatch, user } = this.props;
    const { emailRecipients } = settings;
    return (
      <>
        <>
          <Container fluid>
            <Card>
              <CardBody>
                <DMBreadCrumb links={[{ label: 'email.recipients', link: '#' }]} />
                <div className="btn-toolbar padding-left-20">
                  <div className="btn-group" role="group" aria-label="First group">
                    <ActionButton label="New" onClick={this.onConfigureRecipient} icon={faPlus} isDisabled={!hasRequestedPrivileges(user, ['recipient.add'])} t={t} key="newRecipient" />
                  </div>
                </div>
                <DMTable
                  columns={TABLE_EMAIL_RECIPIENTS}
                  data={emailRecipients}
                  primaryKey="id"
                  dispatch={dispatch}
                  user={user}
                />

              </CardBody>
            </Card>
          </Container>
        </>
      </>
    );
  }

  render() {
    const { settings, t, user } = this.props;
    const { email } = settings;
    if (email == null) {
      return (
        <>
          <>
            <Container fluid>
              <Card>
                <CardBody>
                  <DMBreadCrumb links={[{ label: 'email', link: '#' }]} />
                  <Row>
                    <Col sm={6} className="text-danger"> Email settings not configured.</Col>
                    <Col sm={6}>
                      <ActionButton label="Configure Now" onClick={this.onConfigureEmail} isDisabled={!hasRequestedPrivileges(user, ['email.config'])} t={t} key="configureEmail" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Container>
          </>
        </>
      );
    }
    const fields = [{ label: 'Email Address', value: email.emailAddress }, { label: 'SMTP Host', value: email.smtpHost }, { label: 'SMTP Port', value: email.smtpPort }];
    return (
      <div>
        <Container fluid>
          <Card>
            <CardBody>
              <DMBreadCrumb links={[{ label: 'email', link: '#' }]} />
              <Row className="padding-top-10 padding-bottom-10 margin-left-10">
                <Col sm={12} className="margin-top-10">
                  <ActionButton label="Reconfigure" onClick={this.onReconfigureEmail} isDisabled={!hasRequestedPrivileges(user, ['email.config'])} t={t} key="reconfigureEmail" />
                </Col>
                <Col sm={4}>
                  {
                    fields.map((f) => (
                      <Row>
                        <Col className="margin-top-10" sm={6}>{f.label}</Col>
                        <Col className="margin-top-10 text-muted" sm={6}>{f.value}</Col>
                      </Row>
                    ))
                  }
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
        {this.renderRecipients()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { settings, user } = state;
  return { settings, user };
}
export default connect(mapStateToProps)(withTranslation()(EmailSettings));
