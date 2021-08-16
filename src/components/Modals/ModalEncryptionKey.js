import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Form, Input, Label } from 'reactstrap';
import { hideApplicationLoader, showApplicationLoader } from '../../store/actions';
import { NODE_GET_ENCRYPTION_KEY } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { closeModal } from '../../store/actions/ModalActions';
import { createPayload, API_TYPES, callAPI } from '../../utils/ApiUtils';

/**
 * Modal to authenticate and provide node
 * Encryption key
 */
class ModalEncryptionKey extends Component {
  constructor() {
    super();
    this.state = { errorKey: 'Encryption key not configured.', encryptionKey: '', error: '', password: '' };
    this.onFetchKey = this.onFetchKey.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onCopyEncryptionKey = this.onCopyEncryptionKey.bind(this);
  }

  onClose() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  handleChange = (e) => {
    this.setState({
      password: e.target.value,
      error: '',
    });
  }

  onFilterKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  onCopyEncryptionKey() {
    const { dispatch } = this.props;
    const { encryptionKey } = this.state;
    navigator.clipboard.writeText(encryptionKey);
    dispatch(addMessage('Encryption key copied to clipboard.', MESSAGE_TYPES.INFO));
  }

  onFetchKey() {
    const { options, dispatch } = this.props;
    const { password, errorKey } = this.state;
    const { data } = options;
    if (password.length === 0) {
      this.setState({ error: 'Enter admin password' });
      return;
    }
    const url = NODE_GET_ENCRYPTION_KEY.replace('<id>', data.id);
    const obj = createPayload(API_TYPES.POST, { username: 'admin', password });
    dispatch(showApplicationLoader(url, `Fetching encryption key ${data.name}`));
    return callAPI(url, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(url));
        if (json === '') {
          this.setState({ encryptionKey: errorKey });
          return;
        }
        this.setState({ encryptionKey: json });
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        dispatch(hideApplicationLoader(url));
      });
  }

  renderKey() {
    const { options } = this.props;
    const { data } = options;
    const { errorKey, encryptionKey } = this.state;
    if (encryptionKey === '') {
      return null;
    }
    const message = (encryptionKey !== errorKey ? encryptionKey : `Encryption key not configured for ${data.name}`);
    return (
      <div className="padding-left-20 padding-top-20">
        <a className="text-success" href="#" onClick={encryptionKey !== errorKey ? this.onCopyEncryptionKey : null}>
          {encryptionKey !== errorKey ? <i className="far fa-copy text-secondary padding-right-20" /> : null}
          <Label className={`${encryptionKey !== errorKey ? 'text-success' : 'text-danger'}`}>
            {message}
          </Label>
        </a>
      </div>
    );
  }

  render() {
    const { error, password } = this.state;
    return (
      <>
        <Container>
          <Card>
            <CardBody>
              <Form>
                <div className="form-group row">
                  <div className="col-sm-12">
                    <Input type="password" placeholder="Admin password" className="form-control" id="description-input" value={password} autoComplete="off" onChange={this.handleChange} maxLength="80" onKeyPress={this.onFilterKeyPress} />
                    {error.length > 0 ? <span className="error">{error}</span> : null}
                  </div>
                </div>
              </Form>
              {this.renderKey()}
            </CardBody>
          </Card>
          <div className="modal-footer">
            <button id="btn-modal-close" type="button" className="btn btn-secondary" onClick={this.onClose}>Close </button>
            <button id="btn-encryption" type="button" className="btn btn-success" onClick={this.onFetchKey}>  Get Encryption Key </button>
          </div>
        </Container>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ModalEncryptionKey));
