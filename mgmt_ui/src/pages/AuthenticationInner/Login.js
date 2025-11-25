import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
// // Redux
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, Container, Input, Row } from 'reactstrap';
import logo from '../../assets/images/logo.png';
import saml from '../../assets/images/saml.svg';
import { API_SAML } from '../../constants/ApiConstants';
import { FIELD_TYPE } from '../../constants/FieldsConstant';
import { getInfo, initResetPassword, login } from '../../store/actions';
import ChangePassword from './ChangePassword';
import ResetPassword from './ResetPassword';

function Login(props) {
  const { dispatch, user, t } = props;
  const { passwordChangeReq, passwordResetReq } = user;
  const [state, setState] = useState({ username: '', password: '', isFocused: false, userError: '', passwordError: '', type: FIELD_TYPE.PASSWORD });
  const history = useNavigate();
  const skipBlurRef = useRef(false);
  useEffect(() => {
    if (!passwordChangeReq) {
      dispatch(getInfo(history));
    }

    return () => {
      if (!passwordChangeReq) {
        dispatch(getInfo(history));
      }
    };
  }, []);

  const handleChange = (e) => {
    if (e.target.id === 'username') {
      setState((p) => ({ ...p, userError: '' }));
    } else {
      setState((p) => ({ ...p, passwordError: '' }));
    }
    setState((p) => ({
      ...p,
      [e.target.id]: e.target.value,
    }));
  };

  const handleFocus = (val) => {
    setState((p) => ({
      ...p,
      isFocused: val,
    }));
  };

  // function to open saml login page in same tab
  const onActiveDirectoryLogin = (e) => {
    e.preventDefault();
    window.open(`https://${window.location.host}/${API_SAML}`, '_self');
  };

  const handleReset = () => {
    dispatch(initResetPassword(true, true));
  };

  function onSubmit(e) {
    e.preventDefault();
    const { username, password } = state;
    if (!username || !password) {
      setState((prev) => ({
        ...prev,
        userError: !username ? 'This Field is Invalid' : '',
        passwordError: !password ? 'This Field is Invalid' : '',
      }));
      return;
    }
    dispatch(login({ username, password, history }));
  }

  const onBlurusername = () => {
    const { username } = state;
    if (skipBlurRef.current) {
      skipBlurRef.current = false; // Reset the flag
      return; // Don't run blur logic
    }
    if (username === '') {
      setState((p) => ({ ...p, userError: 'This Field is Invalid' }));
    }
  };

  const onBlurpassword = () => {
    const { password } = state;
    if (skipBlurRef.current) {
      skipBlurRef.current = false; // Reset the flag
      return; // Don't run blur logic
    }
    if (password === '') {
      setState((p) => ({ ...p, passwordError: 'This Field is Invalid' }));
    }
  };

  const typeToggle = () => {
    const { type } = state;
    const newtype = (type === FIELD_TYPE.PASSWORD ? FIELD_TYPE.TEXT : FIELD_TYPE.PASSWORD);
    setState((p) => ({ ...p, type: newtype }));
  };

  const showPasswordToggle = () => {
    const { type, isFocused, password } = state;
    const icon = (type === FIELD_TYPE.PASSWORD ? faEyeSlash : faEye);
    const focused = isFocused;
    if (password && password.length > 0) {
      return (
        <span className={focused ? 'field-icon' : 'field-icon'}>
          <FontAwesomeIcon size="sm" icon={icon} onClick={typeToggle} />
        </span>
      );
    }
  };

  const renderError = (hasError, fieldKey) => {
    if (hasError) {
      return (
        <small className="form-text app_danger padding-left-1" htmlFor={fieldKey}>{hasError}</small>
      );
    }
    return null;
  };

  const renderLoginInputs = () => {
    const { username, password, userError, passwordError, type } = state;
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
                onBlur={onBlurusername}
                onChange={handleChange}
                invalid={userError}
                autoComplete="off"
                placeholder="Username"
                onFocus={() => handleFocus(true)}
                autoFocus
              />
            </div>
            {renderError(userError, username)}
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
                onBlur={onBlurpassword}
                onChange={handleChange}
                invalid={passwordError}
                autoComplete="off"
                placeholder="Password"
                onFocus={() => handleFocus(true)}
              />
              {showPasswordToggle()}
            </div>
            {renderError(passwordError, password)}
          </Col>
        </Row>
      </>
    );
  };

  if (passwordChangeReq) {
    return (<ChangePassword {...props} />);
  }
  if (passwordResetReq) {
    return (<ResetPassword {...props} />);
  }
  return (
    <>
      <div className="account-pages my-5 pt-sm-5">
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
                        <div className="logo-lg logo-name-size dmname dm-logo-color">
                          <p style={{ fontSize: '28px', fontWeight: 'none' }} className="mb-0  mt-2">DATAMOTIVE</p>
                          <small style={{ position: 'relative', fontSize: '12px', top: '-10px' }}>Eliminating Cloud Boundaries</small>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <form onSubmit={onSubmit}>
                      {renderLoginInputs()}
                      <div className="mt-3">
                        <button
                          className="btn btn-success btn-block waves-effect waves-light w-100"
                          type="submit"
                          id="login_submit_btn"
                        >
                          {t('auth.login')}
                        </button>
                      </div>
                    </form>
                    <div className="forgot-container">
                      <Link
                        to="#"
                        onClick={handleReset}
                        onMouseDown={() => {
                          skipBlurRef.current = true;
                        }}
                        className="text-success"
                      >
                        {t('forgot.password')}

                      </Link>
                    </div>
                    <div className="mt-3 text-center muted">
                      <hr />
                      <div>
                        {t('auth.signinWith')}
                      </div>
                    </div>
                    <div className="mt-3 ">
                      <button
                        className="btn btn-secondary btn-block waves-effect waves-light w-100"
                        type="button"
                        onClick={onActiveDirectoryLogin}
                        onMouseDown={() => {
                          skipBlurRef.current = true;
                        }}
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

export default withTranslation()(Login);
