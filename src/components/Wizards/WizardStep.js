import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CardBody, Form } from 'reactstrap';
import { getValue } from '../../utils/InputUtils';
import { PLATFORM_TYPES, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { getFilteredObject } from '../../utils/PayloadUtil';
import DMField from '../Shared/DMField';

function WizardStep(props) {
  const sites = useSelector((state) => state.sites.sites);

  const { dispatch, user, fields, t } = props;
  const { values } = user;
  if (!fields && fields.length <= 0) {
    return null;
  }

  const enableReverseField = fields.some((f) => f === 'drplan.enableReverse') || '';
  const showVmwareRevereseWarningText = () => {
    const enableReverse = getValue('drplan.enableReverse', values) || '';
    const rSiteId = getValue('drplan.recoverySite', values);
    const pSiteId = getValue('drplan.protectedSite', values);
    const rSite = sites.filter((site) => getFilteredObject(site, rSiteId, 'id'))[0];
    const pSite = sites.filter((site) => getFilteredObject(site, pSiteId, 'id'))[0];
    const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values) || '';
    if (enableReverse && enableReverseField) {
      if (workflow === UI_WORKFLOW.REVERSE_PLAN && typeof pSite !== 'undefined' && pSite.platformDetails.platformType === PLATFORM_TYPES.VMware || typeof rSite !== 'undefined' && rSite.platformDetails.platformType === PLATFORM_TYPES.VMware) {
        return true;
      }
    }
    return false;
  };
  const renderSubText = () => (
    <div className="card_note_warning margin-top-5">
      <i className="fas fa-exclamation-triangle" />
          &nbsp;&nbsp;&nbsp;
      {t('vmware.diff.rev.warning')}
    </div>
  );
  return (
    <>
      <CardBody className="modal-card-body">
        <Form>
          {
              fields.map((field) => (<DMField key={`${field}-DMField-key`} dispatch={dispatch} user={user} fieldKey={field} />))
            }

        </Form>
        {showVmwareRevereseWarningText() ? renderSubText() : null}
      </CardBody>
    </>
  );
}

export default (withTranslation()(WizardStep));
