import React, { Component } from 'react';

// Redux
import { Link, withRouter } from 'react-router-dom';

import {
  Row, Col, CardBody, Card, Container,
} from 'reactstrap';

// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';

// import images
import logo from '../../assets/images/logo.png';
import logoName from '../../assets/images/name.png';
import { getInfo, login } from '../../store/actions';

class Login extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { userName: '', password: '' };
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
    e.preventDefault();
    const { dispatch, history } = this.props;
    const { userName, password } = this.state;
    dispatch(login({ username: userName, password, history }));
  }

  render() {
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
                      <AvForm className="form-horizontal">
                        <div className="form-group">
                          <AvField
                            name="username"
                            label="Username"
                            value=""
                            className="form-control"
                            placeholder="Enter username"
                            type="text"
                            id="userName"
                            onChange={this.handleChange}
                            autoComplete="off"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <AvField
                            name="password"
                            label="Password"
                            value=""
                            type="password"
                            id="password"
                            required
                            placeholder="Enter password"
                            onChange={this.handleChange}
                          />
                        </div>
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
                      </AvForm>
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
