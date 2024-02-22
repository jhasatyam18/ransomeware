import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Tooltip } from 'reactstrap';
import { closeModal } from '../../store/actions/ModalActions';
import { valueChange } from '../../store/actions/UserActions';
import { STATIC_KEYS } from '../../constants/InputConstants';

function ModalCBTConfirmation(props) {
  const { t, modal, dispatch } = props;
  const { options } = modal;
  const { selectedVMs = {} } = options;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  function vmsName() {
    if (Object.keys(selectedVMs).length > 0) {
      const disabledCBTVMs = [];
      Object.keys(selectedVMs).forEach((vm) => {
        if (!selectedVMs[vm].changeTracking) {
          disabledCBTVMs.push(selectedVMs[vm]);
        }
      });
      if (disabledCBTVMs.length > 4) {
        const firstFourVMsNames = disabledCBTVMs.slice(0, 4).map((vm) => vm.name).join(', ');
        return (
          <>
            <span className="unfocused">{ firstFourVMsNames }</span>
            <span id="remainingVM">
              ...
              <Tooltip
                placement="auto"
                isOpen={tooltipOpen}
                target="remainingVM"
                toggle={toggle}
              >
                {disabledCBTVMs.slice(4, disabledCBTVMs.length).map((vm) => vm.name).join(', ')}
              </Tooltip>
            </span>
          </>
        );
      }
      return <span className="unfocused">{disabledCBTVMs.map((vm) => vm.name).join(', ')}</span>;
    }
    return null;
  }

  const alertMessage = () => (
    <div className="col-sm-12 confirmation_modal_msg">
      <span>{t('confirm.cbt.warning')}</span>
      {vmsName()}
      <p className="unfocused margin-top-25">{t('confirm.cbt.instruction')}</p>
      <p>
        <span>{t('confirm.cbt.clickEnableCBT')}</span>
        <span className="unfocused">{t('confirm.cbt.toConfigureVM')}</span>
      </p>
      <p>
        <span>{t('confirm.cbt.clickCancel')}</span>
        <span className="unfocused">{t('confirm.cbt.toCancelManually')}</span>
        <span><a href={STATIC_KEYS.VMWARE_CBT_KB_REFERENCE} rel="noreferrer" target="_blank">{t('click.here')}</a></span>
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
        <div className="container padding-20">
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
