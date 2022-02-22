import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

// Import Images

class Pages404 extends Component {
  render() {
    const { t } = this.props;
    return (
      <>
        <div className="account-pages my-5 pt-5">
          <Container>
            <Row>
              <Col lg="12">
                <div className="text-center mb-5">
                  <h1 className="display-2 font-weight-medium">
                    4
                    0
                    4
                  </h1>
                  <h4 className="text-uppercase">{t('sorry.page.not.found')}</h4>
                  <div className="mt-5 text-center">
                    <Link
                      className="btn btn-primary waves-effect waves-light"
                      to="/dashboard"
                    >
                      {t('back.to.dashboard')}
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default (withTranslation()(Pages404));
