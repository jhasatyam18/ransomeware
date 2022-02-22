import React, { Component } from 'react';
import { Form, CardBody } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DMField from '../Shared/DMField';
import { FIELDS } from '../../constants/FieldsConstant';
import { closeModal } from '../../store/actions/ModalActions';
import { configureNode } from '../../store/actions/NodeActions';
import { validateForm } from '../../utils/validationUtils';
import { getNodePayload } from '../../utils/PayloadUtil';

class ModalConfigureNode extends Component {
  constructor() {
    super();
    this.onClose = this.onClose.bind(this);
    this.onConfigureNode = this.onConfigureNode.bind(this);
  }

  onClose() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  onConfigureNode() {
    const { user, dispatch, options } = this.props;
    const { isUpdate, id } = options;
    if (validateForm('node.', user, dispatch)) {
      const payload = getNodePayload(user);
      if (isUpdate) {
        dispatch(configureNode({ ...payload.node, id }));
      } else {
        dispatch(configureNode({ ...payload.node }));
      }
    }
  }

  renderFooter() {
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={this.onClose}>Close </button>
        <button type="button" className="btn btn-success" onClick={this.onConfigureNode}> Configure </button>
      </div>
    );
  }

  renderForm() {
    const { user, dispatch, options } = this.props;
    const { isUpdate } = options;
    const fields = Object.keys(FIELDS).filter((key) => key.indexOf('node.') !== -1);
    const renderFields = [];
    fields.forEach((field) => {
      let shouldDisable = false;
      if (typeof isUpdate !== 'undefined') {
        const allowedFields = ['username', 'password', 'managementPort', 'replicationPort', 'encryptionKey', 'hostname'];
        const fName = field.split('.')[1];
        shouldDisable = isUpdate && !(allowedFields.indexOf(fName) !== -1);
      }
      renderFields.push((<DMField dispatch={dispatch} user={user} fieldKey={field} key={`node-${field}`} disabled={shouldDisable} />));
    });
    return (
      <CardBody className="modal-card-body">
        <Form>
          {
            renderFields
          }
        </Form>
      </CardBody>
    );
  }

  render() {
    return (
      <>
        <div className="modal-body noPadding">
          <SimpleBar style={{ maxHeight: '400px' }}>
            {this.renderForm()}
          </SimpleBar>
        </div>
        {this.renderFooter()}
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ModalConfigureNode));
