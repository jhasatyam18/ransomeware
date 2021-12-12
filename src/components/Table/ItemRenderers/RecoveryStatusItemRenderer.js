import React from 'react';
import { Badge } from 'reactstrap';
import { withTranslation } from 'react-i18next';

function RecoveryStatusItemRenderer(props) {
  const { t, data } = props;
  if (!data) {
    return '-';
  }
  if (data.isRemovedFromPlan === true) {
    const msg = t('vm.remove.description');
    return (
      <div>
        <Badge title={msg} className="font-size-13 badge-soft-info" color="info" pill>
          {t('removing')}
        </Badge>
      </div>
    );
  }
  function renderDeleted() {
    if (data.isDeleted === true) {
      return (
        <div>
          <Badge className="font-size-13 badge-soft-danger" color="danger" pill>
            Deleted From Source
          </Badge>
        </div>
      );
    }
    return null;
  }

  function renderStatus() {
    if (typeof data.recoveryStatus === 'undefined') {
      return null;
    }
    return (
      <div>
        <Badge className="font-size-13 badge-soft-success" color="success" pill>
          {data.recoveryStatus}
        </Badge>
      </div>
    );
  }

  return (
    <>
      { renderDeleted() }
      { renderStatus() }
    </>
  );
}

export default (withTranslation()(RecoveryStatusItemRenderer));
