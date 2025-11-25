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
    const { license, platformType } = user;
    const { version, nodeKey, activeLicenses } = license;
    let key = '';
    if (typeof nodeKey === 'undefined' || typeof activeLicenses === 'undefined' || typeof version === 'undefined') {
      return null;
    }
    for (let i = 0; i < nodeKey.length; i += 1) {
      if (i !== 0 && i % 4 === 0) {
        key = `${key}-${nodeKey[i]}`;
      } else {
        key = `${key}${nodeKey[i]}`;
      }
    }
    const info = [
      { label: 'Version', value: version },
      { label: 'Platform Type', value: platformType },
      { label: 'Node Key ', value: key },
      { label: 'Active Licenses', value: activeLicenses },
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
                <Col sm={8}>
                  <p>{task.value}</p>
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
