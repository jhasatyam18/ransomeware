import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { validatedNewAndCnfmPass } from '../../utils/validationUtils';
import logo from '../../assets/images/logo.png';
import logoName from '../../assets/images/name.png';
import { getValue } from '../../utils/InputUtils';
import { resetCredetials } from '../../store/actions';
import ResetPasswordField from './ResetPasswordField';

const ResetPassword = (props) => {
  const { t, dispatch, user } = props;
  const { values } = user;
  const { allowReset } = user;
  const [resetingType, setResetingType] = useState('password');

  function RenderOptions() {
    return (
      <>
        <div className="form-check-inline p-2">
          <Label className="form-check-label">
            <input type="radio" className="form-check-input" name="resetType" value="password" checked={resetingType === 'password'} onChange={(e) => setResetingType(e.target.value)} />
            {t('password')}
          </Label>
        </div>
        <div className="form-check-inline">
          <Label className="form-check-label">
            <input type="radio" className="form-check-input" name="resetType" value="shh_key" checked={resetingType === 'shh_key'} onChange={(e) => setResetingType(e.target.value)} />
            {t('shh_key')}
          </Label>
        </div>
      </>
    );
  }

  const onfieldCheck = () => {
    if (validatedNewAndCnfmPass(user)) return true;
  };

  const onChange = (e) => {
    e.preventDefault();
    const userName = getValue('user.username', values);
    const systemUser = getValue('user.systemUsername', values);
    const newPass = getValue('user.newPassword', values);
    if (onfieldCheck()) {
      if (resetingType === 'password') {
        const systemPass = getValue('user.systemPassword', values);
        dispatch(resetCredetials({ newPassword: newPass, systemPassword: systemPass, systemUsername: systemUser, username: userName }));
      } else {
        const SSHKey = getValue('user.ssh_key', values);
        dispatch(resetCredetials({ newPassword: newPass, systemSSHKey: SSHKey, systemUsername: systemUser, username: userName }));
      }
    } else {
      document.getElementById('user.confirmPassword').focus();
    }
  };

  const onClose = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <div>
      <>
        <div id="password-parent" className="account-pages my-5 pt-sm-5">
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
                    <ResetPasswordField dispatch={dispatch} user={user} resetingType={resetingType} RenderOptions={RenderOptions} />
                    <Row>
                      <Col sm={12}>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={onClose}>{t('close')}</button>
                          { allowReset ? <button type="button" className="btn btn-success" onClick={onChange}>{t('change.password')}</button> : null }
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    </div>
  );
};

export default (withTranslation()(ResetPassword));
