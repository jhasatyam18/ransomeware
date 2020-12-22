import React, { Component } from 'react';
import SimpleBar from 'simplebar-react';
import ConfigureSite from '../Forms/ConfigureSite';
import { closeModal } from '../../store/actions/ModalAcions';
import { confiureSite } from '../../store/actions/SiteActions';
import { getConfigureSitePayload } from '../../utils/PayloadUtil';
import { validateConfigureSite } from '../../utils/validationUtils';

class ModalConfigureSite extends Component {
  constructor() {
    super();
    this.onClose = this.onClose.bind(this);
    this.onConfigureSite = this.onConfigureSite.bind(this);
  }

  onClose() {
    const { dispatch } = this.props;
    this.onConfigureSite = this.onConfigureSite.bind(this);
    dispatch(closeModal());
  }

  onConfigureSite() {
    const { user, dispatch, modal } = this.props;
    const { options } = modal;
    const { isEdit } = options;
    if (validateConfigureSite(user, dispatch)) {
      const payload = getConfigureSitePayload(user);
      if (isEdit) {
        payload.id = options.id;
        dispatch(confiureSite(payload, true));
      } else {
        dispatch(confiureSite(payload, false));
      }
    }
  }

  renderFooter() {
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={this.onClose}>Close </button>
        <button type="button" className="btn btn-primary" onClick={this.onConfigureSite}> Configure </button>
      </div>
    );
  }

  renderForm() {

  }

  render() {
    return (
      <>
        <div className="modal-body noPadding">
          <SimpleBar style={{ maxHeight: '400px' }}>
            <ConfigureSite {...this.props} />
          </SimpleBar>

        </div>
        {this.renderFooter()}
      </>
    );
  }
}

export default ModalConfigureSite;
