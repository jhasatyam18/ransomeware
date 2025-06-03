import React, { Component } from 'react';
import { Form } from 'reactstrap';
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
    const { values } = user;
    let isUpdate = '';
    if (options) {
      isUpdate = options.isUpdate;
    }
    // const { isUpdate } = options;
    const fields = Object.keys(FIELDS).filter((key) => key.indexOf('node.') !== -1);
    const renderFields = [];
    fields.forEach((field) => {
      let shouldDisable = false;
      if (typeof isUpdate !== 'undefined') {
        const allowedFields = ['username', 'password', 'hostname'];
        const ports = ['replicationDataPort', 'replicationCtrlPort', 'managementPort', 'name'];
        const fName = field.split('.')[1];
        const isLocalNode = values['node.isLocalNode'];
        shouldDisable = isUpdate && !(allowedFields.indexOf(fName) !== -1);
        if (!isLocalNode && ports.indexOf(fName) !== -1) {
          shouldDisable = false;
        }
      }
      renderFields.push((<DMField dispatch={dispatch} user={user} fieldKey={field} key={`node-${field}`} disabled={shouldDisable} />));
    });
    return (
      <Form>
        {
            renderFields
          }
      </Form>
    );
  }

  render() {
    return (
      <>
        <SimpleBar className="max-h-400">
          <div className="modal-body ">
            {this.renderForm()}
          </div>
        </SimpleBar>
        {this.renderFooter()}
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user, dispatch } = state;
  return { user, dispatch };
}
export default connect(mapStateToProps)(withTranslation()(ModalConfigureNode));
