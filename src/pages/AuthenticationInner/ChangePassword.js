import React, { Component } from 'react';
// Redux
import { Link, withRouter } from 'react-router-dom';
import { Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { changeUserPassword } from '../../store/actions';
// import images
import logo from '../../assets/images/logo.png';
import logoName from '../../assets/images/name.png';
import DMFieldText from '../../components/Shared/DMFieldText';
import { FIELD_TYPE } from '../../constants/FieldsConstant';
import { PASSWORD_REGEX } from '../../constants/ValidationConstants';
import { validatePassword, isEmpty } from '../../utils/validationUtils';
import { getValue } from '../../utils/InputUtils';

class ChangePassword extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { user, dispatch } = this.props;
    const { values, errors } = user;
    const oldPassword = getValue('user.oldPassword', values);
    const password = getValue('user.newPassword', values);
    const cnfPassword = getValue('user.confirmPassword', values);
    if (oldPassword !== '' && password === cnfPassword && errors && !errors['user.newPassword'] && !errors['user.confirmPassword'] && !errors['user.oldPassword']) {
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
    const oldPassword = { label: 'Current password', placeHolderText: 'Enter current password', type: FIELD_TYPE.PASSOWRD, validate: (v, u) => isEmpty(v, u), errorMessage: 'Enter current password', shouldShow: true };
    const password = { label: 'New Password', placeHolderText: 'Enter new password', type: FIELD_TYPE.PASSOWRD, patterns: [PASSWORD_REGEX], errorMessage: 'Password should have 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long.', shouldShow: true };
    const cnfPassword = { label: 'Confirm Password', placeHolderText: 'Confirm password', type: FIELD_TYPE.PASSOWRD, validate: (v, u) => validatePassword(v, u), errorMessage: 'New password and confirm password does not match', shouldShow: true };
    return (
      <>
        <div className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
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
                  <CardBody className="pt-0">
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
                          <span className="logo-lg">
                            <img
                              src={logoName}
                              className="logo-name-size dmname"
                              alt="DATAMOTIVE"
                            />
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-2">
                      { allowCancel ? null : <Label className="text-danger padding-left-20">Change the default password for &lsquo;admin&rsquo; user</Label>}
                      <DMFieldText dispatch={dispatch} fieldKey="user.oldPassword" field={oldPassword} user={user} hideLabel="true" />
                      <DMFieldText dispatch={dispatch} fieldKey="user.newPassword" field={password} user={user} hideLabel="true" />
                      <DMFieldText dispatch={dispatch} fieldKey="user.confirmPassword" field={cnfPassword} user={user} hideLabel="true" />
                    </div>
                    <div className="mt-3">
                      <button className="btn btn-success btn-block waves-effect waves-light" type="submit" onClick={this.onSubmit}>
                        Change Password
                      </button>
                      { allowCancel ? <button className="btn btn-block waves-effect waves-light" type="submit" onClick={this.onCancel}> Cancel </button> : null }
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

export default (withRouter(ChangePassword));
