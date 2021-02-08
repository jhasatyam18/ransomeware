import React, { Component } from 'react';

// Redux
import { Link, withRouter } from 'react-router-dom';

import {
  Row, Col, CardBody, Card, Container,
} from 'reactstrap';

// import images
import { validateField } from '../../utils/validationUtils';
import logo from '../../assets/images/logo.png';
import logoName from '../../assets/images/name.png';
import { getInfo, login } from '../../store/actions';
import DMField from '../../components/Shared/DMField';
import { FIELDS } from '../../constants/FieldsConstant';
import { getValue } from '../../utils/InputUtils';

class Login extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { dispatch, history } = this.props;
    dispatch(getInfo(history));
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  onSubmit(e) {
    const { user, dispatch } = this.props;
    const { values } = user;
    const username = getValue('login.username', values);
    const password = getValue('login.password', values);

    if (!username && !password) {
      validateField(FIELDS['login.username'], 'login.username', username, dispatch, user);
      validateField(FIELDS['login.password'], 'login.password', password, dispatch, user);
      return;
    }
    e.preventDefault();
    const { history } = this.props;
    dispatch(login({ username: getValue('login.username', values), password: getValue('login.password', values), history }));
  }

  render() {
    const { dispatch, user } = this.props;
    const fields = Object.keys(FIELDS).filter((key) => key.indexOf('login') !== -1);
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
                      {fields.map((field) => (<DMField dispatch={dispatch} user={user} fieldKey={field} />))}
                      <div className="mt-3">
                        <button
                          className="btn btn-success btn-block waves-effect waves-light"
                          type="submit"
                          onClick={this.onSubmit}
                        >
                          Log In
                        </button>
                      </div>
                      <div className="container login">
                        <div className="row">
                          <div className="col-sm-8 text-align sign-up">
                            <a href="">Sign Up</a>
                            <p className="text-align "> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</p>
                            <a href="">Forgot Password</a>
                          </div>
                        </div>
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

export default (withRouter(Login));
