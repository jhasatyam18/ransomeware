import React from 'react';
import { withTranslation } from 'react-i18next';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { closeModal } from '../../store/actions/ModalActions';
import { valueChange } from '../../store/actions/UserActions';

function ModalCBTConfirmation(props) {
  const { t, modal, dispatch } = props;
  const { options } = modal;
  const { selectedVMs = {} } = options;

  function vmsName() {
    if (Object.keys(selectedVMs).length > 0) {
      const disabledCBTVMs = [];
      Object.keys(selectedVMs).forEach((vm) => {
        if (!selectedVMs[vm].changeTracking) {
          disabledCBTVMs.push(selectedVMs[vm]);
        }
      });
      return <span>{disabledCBTVMs.map((vm) => vm.name).join(', ')}</span>;
    }
    return null;
  }

  const alertMessage = () => (
    <div className="col-sm-12 confirmation_modal_msg">
      <span>{t('confirm.cbt.warning')}</span>
      <p style={{ fontWeight: '100', marginBottom: '2px' }}>{vmsName()}</p>
      <p className="unfocused margin-top-5 margin-bottom-2">{t('confirm.cbt.instruction')}</p>
      <p className="margin-bottom-2">
        <span>{t('confirm.cbt.clickEnableCBT')}</span>
        <span className="unfocused">{t('confirm.cbt.toConfigureVM')}</span>
      </p>
      <p className="margin-bottom-2">
        <span>{t('confirm.cbt.clickCancel')}</span>
        <span className="unfocused">{t('confirm.cbt.toCancelManually')}</span>
        <span><a href={STATIC_KEYS.VMWARE_CBT_KB_REFERENCE} rel="noreferrer" target="_blank">{t('click.here')}</a></span>
      </p>
      <p className="cbt_icon__warning margin-top-10">
        <i className="fas fa-exclamation-triangle icon__warning padding-right-7" aria-hidden="true" style={{ height: 20, cursor: 'pointer' }} />
        <snap className="warning ">
          {t('cbt.warning')}
        </snap>
        <a className="d-inline" href="https://kb.vmware.com/s/article/1020128" rel="noreferrer" target="_blank">(https://kb.vmware.com/s/article/1020128)</a>
      </p>
    </div>
  );

  const onClose = () => {
    dispatch(closeModal());
  };

  const onConfirm = () => {
    if (Object.keys(selectedVMs).length > 0) {
      dispatch(valueChange(STATIC_KEYS.UI_DMWIZARD_MOVENEXT, true));
      Object.keys(selectedVMs).forEach((vm) => {
        if (!selectedVMs[vm].changeTracking) {
          selectedVMs[vm].changeTracking = true;
        }
      });
      dispatch(valueChange(STATIC_KEYS.UI_SITE_SELECTED_VMS, selectedVMs));
      dispatch(closeModal());
    }
  };

  function renderFooter() {
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          {t('cancel')}
        </button>
        <button type="button" className="btn btn-success" onClick={onConfirm}>
          {t('enable.cbt')}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="modal-body noPadding">
        <div className="container padding-left-20 padding-top-10 padding-right-20">
          <div className="row">
            <div className="width-100 confirmation_modal_msg">
              {alertMessage()}
            </div>
          </div>
        </div>

      </div>
      {renderFooter()}
    </>
  );
}

export default (withTranslation()(ModalCBTConfirmation));
