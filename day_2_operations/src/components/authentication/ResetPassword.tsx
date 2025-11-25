import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { getValue, resetCredetials, validatedNewAndCnfmPass } from '../../utils/appUtils';
import ResetPasswordField from './ResetPasswordField';
import { UserInterface } from '../../interfaces/interface';

interface ResetPasswordProps extends WithTranslation {
    dispatch: (action: any) => void;
    user: UserInterface;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ t, dispatch, user }) => {
    const { values } = user;
    const [resetingType, setResetingType] = useState<'password' | 'shh_key'>('password');

    function RenderOptions() {
        return (
            <>
                <div className="form-check-inline p-2">
                    <Label className="form-check-label">
                        <input type="radio" className="form-check-input" name="resetType" value="password" checked={resetingType === 'password'} onChange={(e) => setResetingType(e.target.value as 'password' | 'shh_key')} />
                        {'Password'}
                    </Label>
                </div>
                <div className="form-check-inline">
                    <Label className="form-check-label">
                        <input type="radio" className="form-check-input" name="resetType" value="shh_key" checked={resetingType === 'shh_key'} onChange={(e) => setResetingType(e.target.value as 'password' | 'shh_key')} />
                        {'SHH Key'}
                    </Label>
                </div>
            </>
        );
    }

    const onFieldCheck = (): boolean => validatedNewAndCnfmPass(user);

    const onChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const userName = getValue('user.username', values);
        const systemUser = getValue('user.systemUsername', values);
        const newPass = getValue('user.newPassword', values);

        if (onFieldCheck()) {
            if (resetingType === 'password') {
                const systemPass = getValue('user.systemPassword', values);
                dispatch(resetCredetials({ newPassword: newPass, systemPassword: systemPass, systemUsername: systemUser, username: userName }));
            } else {
                const SSHKey = getValue('user.ssh_key', values);
                dispatch(resetCredetials({ newPassword: newPass, systemSSHKey: SSHKey, systemUsername: systemUser, username: userName }));
            }
        } else {
            document.getElementById('user.confirmPassword')?.focus();
        }
    };

    const onClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.location.reload();
    };

    return (
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
                            <CardBody className="pt-0">
                                <div>
                                    <Link to={'/'}>
                                        <div className="avatar-md profile-user-wid mb-4 login">
                                            <span className="avatar-title rounded-circle bg-light logo">
                                                <img src={logo} alt="" className="rounded-circle" height="34" />
                                            </span>
                                            <div className="logo-lg logo-name-size dmname dm-logo-color">
                                                <p style={{ fontSize: '28px', fontWeight: 'none' }} className="mb-0  mt-2">
                                                    DATAMOTIVE
                                                </p>
                                                <small style={{ position: 'relative', fontSize: '12px', top: '-10px' }}>Eliminating Cloud Boundaries</small>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <ResetPasswordField dispatch={dispatch} user={user} resetingType={resetingType} RenderOptions={RenderOptions} />

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                                        {t('close')}
                                    </button>
                                    <button type="button" className="btn btn-success" onClick={onChange}>
                                        {t('change.password')}
                                    </button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default withTranslation()(ResetPassword);
