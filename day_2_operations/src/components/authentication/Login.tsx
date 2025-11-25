import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Input, Row } from 'reactstrap';
import logo from '../../assets/images/logo.png';
import { FIELD_TYPE } from '../../constants/userConstant';
import { UserInterface } from '../../interfaces/interface';
import { getInfo, login } from '../../store/actions/userAction';
// import saml from '../../assets/images/saml.svg';
import { resetPassword } from '../../store/reducers/userReducer';
import ResetPassword from './ResetPassword';
// import { API_SAML } from '../../constants/Api';
import ChangePassword from './ChangePassword';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_PATH } from '../../constants/routeConstant';
interface Props {
    user: UserInterface;
    dispatch: any;
}

const Login: React.FC<Props> = ({ user, dispatch }) => {
    // const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState(FIELD_TYPE.PASSWORD);
    const [userError, setUserError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const skipBlurRef = useRef(false);
    const { passwordChangeReq, passwordReset } = user;
    const history = useNavigate();
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'username') {
            setUsername(value);
            setUserError('');
        } else {
            setPasswordError('');
            setPassword(value);
        }
    };

    function onEnter(e: Event) {
        if (e instanceof KeyboardEvent && e.code === 'Enter' && (e.target as HTMLInputElement).id === 'password') {
            e.preventDefault();
            const submitButton = document.getElementById('login_submit_btn') as HTMLButtonElement;
            if (submitButton) {
                submitButton.focus();
                setTimeout(() => submitButton.click(), 100);
            }
        } else if (e instanceof KeyboardEvent && e.code === 'Enter' && (e.target as HTMLInputElement).id === 'username') {
            document.getElementById('password')?.focus();
        }
    }

    useEffect(() => {
        const { passwordChangeReq } = user;
        if (!passwordChangeReq) {
            dispatch(getInfo(history));
        }

        const loginDiv = document.getElementById('loginpage');
        if (loginDiv) {
            loginDiv.addEventListener('keydown', onEnter);
            return () => loginDiv.removeEventListener('keydown', (e) => e.code === 'Enter' && onEnter(e));
        }
    }, []);

    const onSubmit = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(login({ username, password, history }));
    };

    const onBlurUsername = () => {
        if (skipBlurRef.current) {
            skipBlurRef.current = false; // Reset the flag
            return; // Don't run blur logic
        }
        if (!username) {
            setUserError('This Field is Invalid');
        }
    };

    const onBlurPassword = () => {
        if (skipBlurRef.current) {
            skipBlurRef.current = false; // Reset the flag
            return; // Don't run blur logic
        }
        if (!password) {
            setPasswordError('This Field is Invalid');
        }
    };

    const typeToggle = () => {
        setType(type === FIELD_TYPE.PASSWORD ? FIELD_TYPE.TEXT : FIELD_TYPE.PASSWORD);
    };

    const onPasswordChange = () => {
        dispatch(resetPassword(true));
    };

    const showPasswordToggle = () => {
        const icon = type === FIELD_TYPE.PASSWORD ? faEyeSlash : faEye;
        if (password && password.length > 0) {
            return (
                <span className="field-icon" onClick={typeToggle}>
                    <FontAwesomeIcon size="sm" icon={icon} />
                </span>
            );
        }
    };

    const renderError = (hasError: string) => {
        return hasError ? <small className="form-text app_danger padding-left-1">{hasError}</small> : null;
    };

    const renderLoginInputs = () => {
        return (
            <>
                <Row>
                    <Col sm={12}>
                        <div>
                            <Input type="text" className="form-control" id="username" value={username} onBlur={onBlurUsername} onChange={handleChange} invalid={!!userError} autoComplete="off" placeholder="Username" autoFocus />
                        </div>
                        {renderError(userError)}
                    </Col>
                </Row>
                <Row className="margin-top-15">
                    <Col sm={12}>
                        <div>
                            <Input type={type === FIELD_TYPE.PASSWORD ? 'password' : 'text'} className="form-control" id="password" value={password} onBlur={onBlurPassword} onChange={handleChange} invalid={!!passwordError} autoComplete="off" placeholder="Password" />
                            {showPasswordToggle()}
                        </div>
                        {renderError(passwordError)}
                    </Col>
                </Row>
            </>
        );
    };

    // const onActiveDirectoryLogin = (e: any) => {
    //     e.preventDefault();
    //     window.open(`https://${window.location.host}/${API_SAML}`, '_self');
    // };

    if (passwordReset) {
        return <ResetPassword user={user} dispatch={dispatch} />;
    }
    if (passwordChangeReq) {
        return <ChangePassword user={user} dispatch={dispatch} />;
    }
    return (
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
                                    <Link to={DASHBOARD_PATH}>
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
                                    {renderLoginInputs()}
                                    <div className="mt-3">
                                        <button className="btn btn-success btn-block waves-effect waves-light w-100" type="submit" id="login_submit_btn" onClick={onSubmit}>
                                            Login
                                        </button>
                                    </div>{' '}
                                    <div className="forgot-container">
                                        <Link
                                            to="#"
                                            onMouseDown={() => {
                                                skipBlurRef.current = true;
                                            }}
                                            onClick={onPasswordChange}
                                            className="text-success"
                                        >
                                            Forgot Password
                                        </Link>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
