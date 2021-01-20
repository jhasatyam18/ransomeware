import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { openModal } from '../../../store/actions/ModalActions';
import { MODAL_CONFIGURE_NEW_SITE, MODAL_CONFIRMATION_WARNING } from '../../../constants/Modalconstant';
import { clearValues, valueChange } from '../../../store/actions';
import { deleteSites } from '../../../store/actions/SiteActions';
import { FIELDS } from '../../../constants/FieldsConstant';

class SiteActionBar extends Component {
  constructor() {
    super();
    this.createSite = this.createSite.bind(this);
    this.deleteSelectedSites = this.deleteSelectedSites.bind(this);
    this.reconfigureSite = this.reconfigureSite.bind(this);
  }

  shouldShowAction(isSingle) {
    const { selectedSites } = this.props;
    if (!selectedSites) { return true; }
    const len = Object.keys(selectedSites).length;
    if (!isSingle && len > 0) {
      return false;
    }
    if (isSingle && len === 1) {
      return false;
    }
    return true;
  }

  createSite() {
    const { dispatch } = this.props;
    const options = { isEdit: false, title: 'Create Site' };
    dispatch(clearValues());
    dispatch(openModal(MODAL_CONFIGURE_NEW_SITE, options));
  }

  deleteSelectedSites() {
    const { dispatch } = this.props;
    const options = { title: 'Alert', confirmAction: deleteSites, message: 'Are you sure want to delete selected sites ?' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  reconfigureSite() {
    const { dispatch, selectedSites } = this.props;
    const siteKey = Object.keys(selectedSites)[0];
    dispatch(clearValues());
    Object.keys(FIELDS).filter((key) => key.indexOf('configureSite') !== -1).map((key) => {
      const parts = key.split('.');
      if (parts.length === 2) {
        dispatch(valueChange(key, selectedSites[siteKey][parts[1]]));
      } else {
        dispatch(valueChange(key, selectedSites[siteKey][parts[1]][parts[2]]));
      }
    });
    const options = { isEdit: true, id: selectedSites[siteKey].id, title: 'Reconfigure Site ' };
    dispatch(openModal(MODAL_CONFIGURE_NEW_SITE, options));
  }

  render() {
    return (
      <>
        <div className="btn-toolbar padding-left-20" role="toolbar" aria-label="Toolbar with button groups">
          <div className="btn-group mr-2" role="group" aria-label="First group">
            <button className="btn btn-hover" color="secondary" type="button" onClick={this.createSite}>
              <i className="bx bx-plus" />
              New Site
            </button>
            <button className="btn btn-hover" color="secondary" type="button" onClick={this.deleteSelectedSites} disabled={this.shouldShowAction(false)}>
              <i className="bx bx-trash" />
              Remove
            </button>
            <button className="btn btn-hover" color="secondary" type="button" onClick={this.reconfigureSite} disabled={this.shouldShowAction(true)}>
              <i className="bx bxs-edit" />
              Reconfigure
            </button>
          </div>
        </div>
      </>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedSites: PropTypes.any.isRequired,
};
SiteActionBar.propTypes = propTypes;
export default SiteActionBar;
