import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Form, Input } from 'reactstrap';
import { closeModal } from '../../store/actions/ModalActions';
import { generateSupportBundle } from '../../store/actions/SupportActions';
import { APPLICATION_API_USER } from '../../constants/UserConstant';
import { getCookie } from '../../utils/CookieUtils';

/**
 * Component to generate new support bundle
 */
class ModalSupportBundle extends Component {
  constructor() {
    super();
    this.state = { description: '', error: '' };
    this.onBundleCreate = this.onBundleCreate.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  handleChange = (e) => {
    this.setState({
      description: e.target.value,
      error: '',
    });
  };

  onClose() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  onBundleCreate() {
    const { dispatch } = this.props;
    const { description } = this.state;
    const user = getCookie(APPLICATION_API_USER);
    if (description.length === 0) {
      this.setState({ error: 'Required, message for support bundle generation.' });
      return;
    }
    dispatch(generateSupportBundle({ description, generatedBy: user }));
    dispatch(closeModal());
  }

  render() {
    const { description, error } = this.state;
    return (
      <>
        <Container>
          <Card>
            <CardBody>
              <Form>
                <div className="form-group row">
                  <div className="col-sm-12">
                    <Input type="textarea" placeholder="Description for support bundle generation" className="form-control" id="description-input" value={description} autoComplete="off" onChange={this.handleChange} maxLength="80" />
                    {error.length > 0 ? <span className="error">{error}</span> : null}
                  </div>
                </div>
              </Form>

            </CardBody>
          </Card>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={this.onClose}>Close </button>
            <button type="button" className="btn btn-success" onClick={this.onBundleCreate}>  Generate Bundle </button>
          </div>
        </Container>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { support } = state;
  return { support };
}
export default connect(mapStateToProps)(withTranslation()(ModalSupportBundle));
