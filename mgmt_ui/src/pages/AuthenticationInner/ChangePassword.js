import React, { Component } from 'react';
// Redux
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { getCookie } from '../../utils/CookieUtils';
import { changeUserPassword } from '../../store/actions';
// import images
import logo from '../../assets/images/logo.png';
import DMFieldText from '../../components/Shared/DMFieldText';
import { FIELD_TYPE } from '../../constants/FieldsConstant';
import { PASSWORD_REGEX } from '../../constants/ValidationConstants';
import { validatePassword, isEmpty, validatedNewAndCnfmPass } from '../../utils/validationUtils';
import { getValue } from '../../utils/InputUtils';
import { APPLICATION_API_USER } from '../../constants/UserConstant';

class ChangePassword extends Component {
  constructor() {
    super();
    this.onfieldCheck = this.onfieldCheck.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onEnterCallBack = this.onEnterCallBack.bind(this);
  }

  componentDidMount() {
    document.getElementById('password-parent').addEventListener('keydown', (e) => e.code === 'Enter' && this.onEnter(e));
  }

  componentWillUnmount() {
    document.getElementById('password-parent').removeEventListener('keydown', (e) => e.code === 'Enter' && this.onEnter(e));
  }

  onfieldCheck() {
    const { user } = this.props;
    const { values } = user;
    const oldPassword = getValue('user.oldPassword', values);
    if (oldPassword !== '' && validatedNewAndCnfmPass(user)) return true;
  }

  onEnterCallBack() {
    const { user, dispatch } = this.props;
    const { values } = user;
    const oldPassword = getValue('user.oldPassword', values);
    const password = getValue('user.newPassword', values);
    if (this.onfieldCheck()) {
      dispatch(changeUserPassword(oldPassword, password));
    } else {
      document.getElementById('user.confirmPassword').focus();
    }
  }

  onEnter(e) {
    e.preventDefault();
    if (e.code === 'Enter' && e.target.id === 'user.confirmPassword') {
      document.getElementById('password-btn').focus();
      setTimeout(() => {
        this.onEnterCallBack();
      }, 1000);
    } else {
      document.getElementById('user.confirmPassword').focus();
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const { user, dispatch } = this.props;
    const { values } = user;
    const oldPassword = getValue('user.oldPassword', values);
    const password = getValue('user.newPassword', values);
    if (this.onfieldCheck()) {
      dispatch(changeUserPassword(oldPassword, password));
    } else {
      document.getElementById('user.confirmPassword').focus();
    }
  }

  onCancel(e) {
    e.preventDefault();
    window.location.reload();
  }

  render() {
    const { dispatch, user } = this.props;
    const { allowCancel } = user;
    const oldPassword = { label: 'Current password', placeHolderText: 'Enter current password', type: FIELD_TYPE.PASSWORD, validate: (v, u) => isEmpty(v, u), errorMessage: 'Enter current password', shouldShow: true };
    const password = { label: 'New Password', placeHolderText: 'Enter new password', type: FIELD_TYPE.PASSWORD, patterns: [PASSWORD_REGEX], errorMessage: 'Password should have 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long.', shouldShow: true };
    const cnfPassword = { label: 'Confirm Password', placeHolderText: 'Confirm password', type: FIELD_TYPE.PASSWORD, validate: (v, u) => validatePassword(v, u), errorMessage: 'New password and confirm password does not match', shouldShow: true };
    return (
      <>
        <div id="password-parent" className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col sm={5} lg={5} md={4} xl={5} xxl={4}>
                <Card className="overflow-hidden">
                  <div className="login__soft__bg">
                    <Row>
                      <Col className="col-7">
                        <div className="text-primary p-4">
                          <pre> </pre>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0 ">
                    <div>
                      <Link to="/">
                        <div className="avatar-md profile-user-wid mb-4 login">
                          <span className="avatar-title rounded-circle bg-light logo">
                            <img
                              src={logo}
                              alt=""
                              className="rounded-circle"
                              height="34"
                            />
                          </span>
                          <div className="logo-lg logo-name-size dmname dm-logo-color">
                            <p style={{ fontSize: '28px', fontWeight: 'none' }} className="mb-0  mt-2">DATAMOTIVE</p>
                            <small style={{ position: 'relative', fontSize: '12px', top: '-10px' }}>Eliminating Cloud Boundaries</small>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div style={{ width: '90%', margin: 'auto' }} className="card margin-auto">
                      { allowCancel ? null
                        : (
                          <Label className="text-danger padding-left-20">
                            Change the default password for &lsquo;
                            {getCookie(APPLICATION_API_USER)}
                            &rsquo; user
                          </Label>
                        )}
                      <DMFieldText dispatch={dispatch} fieldKey="user.oldPassword" field={oldPassword} user={user} hideLabel />
                      <DMFieldText dispatch={dispatch} fieldKey="user.newPassword" field={password} user={user} hideLabel />
                      <DMFieldText dispatch={dispatch} fieldKey="user.confirmPassword" field={cnfPassword} user={user} hideLabel />
                    </div>
                    <div className="mt-3 pe-3 ps-3">
                      <button id="password-btn" className="w-100 btn btn-success btn-block waves-effect waves-light" type="submit" onClick={this.onSubmit}>
                        Change Password
                      </button>
                    </div>
                    <div className="d-flex justify-content-center">
                      { allowCancel ? <button className="btn btn-secondary-outline waves-effect waves-light" type="submit" onClick={this.onCancel}> Cancel </button> : null }

                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default ChangePassword;
