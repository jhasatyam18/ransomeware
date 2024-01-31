import React, { useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import { Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { configurePlaybookGenerate } from '../../store/actions/DrPlaybooksActions';
import { valueChange } from '../../store/actions';
import { fetchSites } from '../../store/actions/SiteActions';
import { getValue } from '../../utils/InputUtils';
import DMFieldSelect from '../Shared/DMFieldSelect';
import { FIELDS } from '../../constants/FieldsConstant';
import { MODAL_PLAYBOOK_DOWNLOAD } from '../../constants/Modalconstant';
import { closeModal } from '../../store/actions/ModalActions';
import DRPlanProtectVMStep from '../Wizards/DRPlanProtectVMStep';

function PlaybookGenerateModal(props) {
  const recoverySiteField = FIELDS['drplan.recoverySite'];
  const sourceSiteField = FIELDS['drplan.protectedSite'];
  const { t } = props;

  useEffect(() => {
    const { dispatch } = props;
    dispatch(fetchSites('ui.values.sites'));
  }, []);

  recoverySiteField.onChange = ({ value }) => (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const sites = getValue('ui.values.sites', values);
    if (value) {
      const platfromType = sites.filter((site) => `${site.id}` === `${value}`)[0].platformDetails.platformType;
      dispatch(valueChange('ui.values.recoveryPlatform', platfromType));
    }
  };

  const onClose = () => {
    const { dispatch } = props;
    dispatch(closeModal(MODAL_PLAYBOOK_DOWNLOAD));
  };

  const onConfigure = () => {
    const { dispatch } = props;
    dispatch(configurePlaybookGenerate());
  };

  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-success" onClick={() => onConfigure()}>
        {t('title.generate.download')}
      </button>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t('close')}
      </button>
    </div>
  );

  const { dispatch, user } = props;
  return (
    <>
      <div style={{ width: '100%', margin: 'auto', padding: '5px' }}>
        <Row className="padding-left-10 margin-top-10">
          <Col sm={2}>
            {t('title.protection.site')}
          </Col>
          <Col sm={7}>
            <DMFieldSelect dispatch={dispatch} fieldKey="drplan.protectedSite" field={sourceSiteField} user={user} hideLabel />
          </Col>
        </Row>
        <Row className="padding-left-10">
          <Col sm={2}>
            {t('title.recovery.site')}
          </Col>
          <Col sm={7}>
            <DMFieldSelect dispatch={dispatch} fieldKey="drplan.recoverySite" field={recoverySiteField} user={user} hideLabel />
          </Col>
        </Row>
        <div style={{ height: '50vh' }}>
          <SimpleBar style={{ minHeight: '50vh', maxHeight: '50vh' }}>
            <DRPlanProtectVMStep {...props} vmCss="bulk_dmtree_vm_div" selectedVmCss="bulk_dmtree_selected_vm_div" />
          </SimpleBar>
        </div>
        {renderFooter()}
      </div>

    </>
  );
}

export default (withTranslation()(PlaybookGenerateModal));
