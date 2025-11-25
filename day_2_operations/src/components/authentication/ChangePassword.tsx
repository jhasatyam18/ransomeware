import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { APPLICATION_API_USER, FIELD_TYPE } from '../../constants/userConstant';
import { getCookie } from '../../utils/apiUtils';
import { changeUserPassword, getValue, validatedNewAndCnfmPass, validatePassword } from '../../utils/appUtils';
import DMFieldText from '../shared/DMFieldText';
import logo from '../../assets/images/logo.png';
import { isEmpty } from '../../utils/ValidationUtils';

interface ChangePasswordProps {
    dispatch: any;
    user: any;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ dispatch, user }) => {
    //const history = useHistory();

    const onFieldCheck = useCallback(() => {
        const { values } = user;
        const oldPassword = getValue('user.oldPassword', values);
        return oldPassword !== '' && validatedNewAndCnfmPass(user);
    }, [user]);

    const onEnterCallBack = useCallback(() => {
        const { values } = user;
        const oldPassword = getValue('user.oldPassword', values);
        const password = getValue('user.newPassword', values);
        if (onFieldCheck()) {
            dispatch(changeUserPassword(oldPassword, password));
        } else {
            document.getElementById('user.confirmPassword')?.focus();
        }
    }, [dispatch, user, onFieldCheck]);

    const onEnter = useCallback(
        (e: KeyboardEvent) => {
            if (e.code === 'Enter' && e.target instanceof HTMLElement) {
                e.preventDefault();
                if (e.target.id === 'user.confirmPassword') {
                    document.getElementById('password-btn')?.focus();
                    setTimeout(onEnterCallBack, 1000);
                } else {
                    document.getElementById('user.confirmPassword')?.focus();
                }
            }
        },
        [onEnterCallBack],
    );

    useEffect(() => {
        const parent = document.getElementById('password-parent');
        parent?.addEventListener('keydown', onEnter);
        return () => parent?.removeEventListener('keydown', onEnter);
    }, [onEnter]);

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { values } = user;
        const oldPassword = getValue('user.oldPassword', values);
        const password = getValue('user.newPassword', values);
        if (onFieldCheck()) {
            dispatch(changeUserPassword(oldPassword, password));
        } else {
            document.getElementById('user.confirmPassword')?.focus();
        }
    };

    const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.location.reload();
    };

    const { allowCancel } = user;
    const oldPasswordField = { label: 'Current password', placeHolderText: 'Enter current password', type: FIELD_TYPE.PASSWORD, validate: isEmpty, errorMessage: 'Enter current password', shouldShow: true };
    const passwordField = { label: 'New Password', placeHolderText: 'Enter new password', type: FIELD_TYPE.PASSWORD, errorMessage: 'Password should have 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long.', shouldShow: true };
    const cnfPasswordField = { label: 'Confirm Password', placeHolderText: 'Confirm password', type: FIELD_TYPE.PASSWORD, validate: validatePassword, errorMessage: 'New password and confirm password do not match', shouldShow: true };

    return (
        <div id="password-parent" className="account-pages my-5 pt-sm-5" style={{ margin: 'auto' }}>
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
                                <div className="p-2">
                                    {!allowCancel && <Label className="text-danger padding-left-20">Change the default password for &lsquo;{getCookie(APPLICATION_API_USER)}&rsquo; user</Label>}
                                    <DMFieldText dispatch={dispatch} fieldKey="user.oldPassword" field={oldPasswordField} user={user} hideLabel="true" />
                                    <DMFieldText dispatch={dispatch} fieldKey="user.newPassword" field={passwordField} user={user} hideLabel="true" />
                                    <DMFieldText dispatch={dispatch} fieldKey="user.confirmPassword" field={cnfPasswordField} user={user} hideLabel="true" />
                                </div>
                                <div className="mt-3 pe-2 ps-2">
                                    <button id="password-btn" className="btn btn-success btn-block waves-effect waves-light w-100" type="button" onClick={onSubmit}>
                                        Change Password
                                    </button>
                                    {allowCancel && (
                                        <button className="btn btn-block waves-effect waves-light w-100" type="button" onClick={onCancel}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ChangePassword;
