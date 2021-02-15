import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { closeModal } from '../../store/actions/ModalActions';

class ModalAbout extends Component {
  constructor() {
    super();
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  renderFooter() {
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={this.onClose}>Close </button>
      </div>
    );
  }

  render() {
    const { user } = this.props;
    const { license } = user;
    const { version, serviceType, licenseType, licenseExpiredTime } = license;
    const d = new Date(licenseExpiredTime * 1000);
    const resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
    const info = [
      { label: 'Version', value: version },
      { label: 'Service Type', value: serviceType },
      { label: 'License Type', value: licenseType },
      { label: 'License Validity', value: resp },
    ];
    return (
      <>
        <div className="modal-body">
          <div className="container">
            {info.map((task) => (
              <Row className="padding-bottom-5">
                <Col sm={4}>
                  {`${task.label}`}
                </Col>
                <Col sm={4}>
                  <p style={{ color: 'white' }}>{task.value}</p>
                </Col>
              </Row>
            ))}
          </div>
        </div>
        {this.renderFooter()}
      </>
    );
  }
}

export default ModalAbout;
