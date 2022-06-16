import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { openModal } from '../../../store/actions/ModalActions';
import { MODAL_CONFIGURE_NEW_SITE, MODAL_CONFIRMATION_WARNING } from '../../../constants/Modalconstant';
import { clearValues, valueChange } from '../../../store/actions';
import { fetchNodes } from '../../../store/actions/NodeActions';
import { deleteSites } from '../../../store/actions/SiteActions';
import { fetchRegions, fetchAvailibilityZones } from '../../../store/actions/AwsActions';
import { FIELDS } from '../../../constants/FieldsConstant';
import ActionButton from '../../Common/ActionButton';
import { STATIC_KEYS } from '../../../constants/InputConstants';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';

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
    dispatch(fetchNodes(STATIC_KEYS.UI_SITE_NODES));
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
    const selectedSitePlatformType = selectedSites[siteKey].platformDetails.platformType;
    dispatch(clearValues());
    dispatch(fetchRegions(selectedSitePlatformType));
    dispatch(fetchAvailibilityZones(selectedSitePlatformType));
    dispatch(fetchNodes(STATIC_KEYS.UI_SITE_NODES));
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
    const { t, user } = this.props;
    const actions = [{ label: 'New', onClick: this.createSite, icon: 'fa fa-plus', isDisabled: !hasRequestedPrivileges(user, ['site.create']) },
      { label: 'Edit', onClick: this.reconfigureSite, icon: 'fa fa-edit', isDisabled: ((!hasRequestedPrivileges(user, ['site.edit'])) || this.shouldShowAction(true)) },
      { label: 'remove', onClick: this.deleteSelectedSites, icon: 'fa fa-trash', isDisabled: (!hasRequestedPrivileges(user, ['site.delete']) || this.shouldShowAction(false)) }];
    return (
      <div className="btn-toolbar padding-left-20">
        <div className="btn-group" role="group" aria-label="First group">
          {actions.map((item) => {
            const { label, onClick, icon, isDisabled } = item;
            return (
              <ActionButton label={label} onClick={onClick} icon={icon} isDisabled={isDisabled} t={t} key={`sitebar-${label}`} />
            );
          })}
        </div>
      </div>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedSites: PropTypes.any.isRequired,
};
SiteActionBar.propTypes = propTypes;
export default (withTranslation()(SiteActionBar));
