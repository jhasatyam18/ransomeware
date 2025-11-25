import React from 'react';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';
import { activateDeactivateLicense } from '../../../store/actions/LicenseActions';

export default function LicenseActionItemRenderer({ data, dispatch, user }) {
  const hasPrivilege = hasRequestedPrivileges(user, ['license.activate', 'license.deactivate']);
  if (!data) {
    return '-';
  }
  const disabled = (data.licenseType === 'Default' || !hasPrivilege);
  function onStateChange(type) {
    dispatch(activateDeactivateLicense(data.ID, type));
  }

  if (disabled || data.isExpired) {
    return (
      '-'
    );
  }

  function renderDeactivate() {
    if (data.isActive === true && hasPrivilege) {
      return (
        <a href="#" onClick={() => onStateChange('deactivate')}>
          <i className="far fa-file-alt margin-left-10 text-danger fa-lg" title="Deactivate" />
        </a>
      );
    }
  }
  function renderActivate() {
    if (data.isActive === false && hasPrivilege) {
      return (
        <a href="#" onClick={() => onStateChange('activate')}>
          <i className="far fa-file-alt margin-left-10 text-success fa-lg" title="Activate" />
        </a>
      );
    }
  }

  return (
    <div>
      {renderActivate()}
      {renderDeactivate()}
    </div>
  );
}
