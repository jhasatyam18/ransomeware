import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
// // Redux
import { Link, withRouter } from 'react-router-dom';
import { Card, CardBody, Col, Container, Input, Row } from 'reactstrap';
import logo from '../../assets/images/logo.png';
import logoName from '../../assets/images/name.png';
import saml from '../../assets/images/saml.svg';
import { API_SAML } from '../../constants/ApiConstants';
import { FIELD_TYPE } from '../../constants/FieldsConstant';
import { getInfo, initResetPassword, login } from '../../store/actions';
import ChangePassword from './ChangePassword';
import ResetPassword from './ResetPassword';

class Login extends Component {
  constructor() {
    super();
    this.state = { username: '', password: '', type: FIELD_TYPE.PASSWORD, isFocused: false, userError: '', passwordError: '' };
    this.onSubmit = this.onSubmit.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
    this.typeToggle = this.typeToggle.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  componentDidMount() {
    const { dispatch, history, user } = this.props;
    const { passwordChangeReq } = user;
    if (!passwordChangeReq) {
      dispatch(getInfo(history));
    }
    const loginDiv = document.getElementById('loginpage');
    if (loginDiv) {
      loginDiv.addEventListener('keydown', (e) => e.code === 'Enter' && this.onEnter(e));
    }
  }

  componentWillUnmount() {
    const loginDiv = document.getElementById('loginpage');
    if (loginDiv) {
      loginDiv.removeEventListener('keydown', (e) => e.code === 'Enter' && this.onEnter(e));
    }
  }

  handleChange = (e) => {
    if (e.target.id === 'username') {
      this.setState({ userError: '' });
    } else {
      this.setState({ passwordError: '' });
    }
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleFocus(val) {
    this.setState({
      isFocused: val,
    });
  }

  // function to open saml login page in same tab
  onActiveDirectoryLogin = (e) => {
    e.preventDefault();
    window.open(`https://${window.location.host}/${API_SAML}`, '_self');
  };

  handleReset = () => {
    const { dispatch } = this.props;
    dispatch(initResetPassword(true, true));
  };

  onEnter(e) {
    e.preventDefault();
    if (e.code === 'Enter' && e.target.id === 'password') {
      document.getElementById('login_submit_btn').focus();
      setTimeout(() => {
        this.onSubmit(e);
      }, 100);
    } else {
      document.getElementById('password').focus();
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const { dispatch, history } = this.props;
    const { username, password } = this.state;
    dispatch(login({ username, password, history }));
  }

  onBlurusername = () => {
    const { username } = this.state;
    if (username === '') {
      this.setState({ userError: 'This Field is Invalid' });
    }
  };

  onBlurpassword = () => {
    const { password } = this.state;
    if (password === '') {
      this.setState({ passwordError: 'This Field is Invalid' });
    }
  };

  typeToggle() {
    const { type } = this.state;
    const newtype = (type === FIELD_TYPE.PASSWORD ? FIELD_TYPE.TEXT : FIELD_TYPE.PASSWORD);
    this.setState({ type: newtype });
  }

  togglePassword() {
    const { type } = this.state;
    const newType = (type === FIELD_TYPE.PASSWORD ? FIELD_TYPE.TEXT : FIELD_TYPE.PASSWORD);
    this.setState({ type: newType });
  }

  showPasswordToggle() {
    const { type, isFocused, password } = this.state;
    const icon = (type === FIELD_TYPE.PASSWORD ? faEyeSlash : faEye);
    const focused = isFocused;
    if (password && password.length > 0) {
      return (
        <span className={focused ? 'field-icon' : 'field-icon'}>
          <FontAwesomeIcon size="sm" icon={icon} onClick={this.typeToggle} />
        </span>
      );
    }
  }

  renderError(hasError, fieldKey) {
    if (hasError) {
      return (
        <small className="form-text app_danger padding-left-1" htmlFor={fieldKey}>{hasError}</small>
      );
    }
    return null;
  }

  renderLoginInputs() {
    const { username, password, userError, passwordError, type } = this.state;
    return (
      <>
        <Row>
          <Col sm={12}>
            <div>
              <Input
                type={FIELD_TYPE.TEXT}
                className="form-control"
                id="username"
                value={username}
                onBlur={this.onBlurusername}
                onChange={this.handleChange}
                invalid={userError}
                autoComplete="off"
                placeholder="Username"
                onFocus={() => this.handleFocus(true)}
                onKeyPress={this.handleKeyPress}
                autoFocus
              />
            </div>
            {this.renderError(userError, username)}
          </Col>
        </Row>
        <Row className="margin-top-15">
          <Col sm={12}>
            <div>
              <Input
                type={type}
                className="form-control"
                id="password"
                value={password}
                onBlur={this.onBlurpassword}
                onChange={this.handleChange}
                invalid={passwordError}
                autoComplete="off"
                placeholder="Password"
                onFocus={() => this.handleFocus(true)}
                onKeyPress={this.handleKeyPress}
              />
              {this.showPasswordToggle()}
            </div>
            {this.renderError(passwordError, password)}
          </Col>
        </Row>
      </>
    );
  }

  render() {
    const { user, t } = this.props;
    const { passwordChangeReq, passwordResetReq } = user;
    if (passwordChangeReq) {
      return (<ChangePassword {...this.props} />);
    }
    if (passwordResetReq) {
      return (<ResetPassword {...this.props} />);
    }
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
                  <CardBody className="pt-0" id="loginpage">
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
                      {this.renderLoginInputs()}
                      <div className="mt-3">
                        <button
                          className="btn btn-success btn-block waves-effect waves-light"
                          type="submit"
                          id="login_submit_btn"
                          onClick={this.onSubmit}
                        >
                          {t('auth.login')}
                        </button>
                      </div>
                      <div className="forgot-container">
                        <Link to="#" onClick={this.handleReset} className="text-success">{t('forgot.password')}</Link>
                      </div>
                      <div className="mt-3 text-center muted">
                        <hr />
                        <div>
                          {t('auth.signinWith')}
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          className="btn btn-secondary btn-block waves-effect waves-light"
                          type="button"
                          onClick={this.onActiveDirectoryLogin}
                        >
                          <img
                            src={saml}
                            alt=""
                            className="rounded-circle"
                            height="22"
                          />
                          {t('auth.activeDirectory')}
                        </button>
                      </div>
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

export default (withTranslation())(withRouter(Login));
