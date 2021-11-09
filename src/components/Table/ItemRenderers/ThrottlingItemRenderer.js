import React from 'react';
import { withTranslation } from 'react-i18next';
import { setBandwidthFields } from '../../../store/actions/ThrottlingAction';
import { clearValues } from '../../../store/actions';
import { openModal } from '../../../store/actions/ModalActions';
import { MODAL_BANDWIDTH_CONFIGURATION } from '../../../constants/Modalconstant';

function ThrottlingItemRenderer(props) {
  const { t, dispatch, data } = props;
  function onBandwidthConfig() {
    dispatch(clearValues());
    const options = { title: t('bandwidth.throttling'), config: data, isUpdate: true, id: data.id, size: 'modal-lg' };
    dispatch(setBandwidthFields(data));
    dispatch(openModal(MODAL_BANDWIDTH_CONFIGURATION, options));
  }

  function renderConfigBandwidth() {
    return (
      <a href="#" onClick={onBandwidthConfig} title="Edit">
        <i className="far fa-edit fa-lg" />
      </a>
    );
  }

  return (
    <div>
      &nbsp;
      &nbsp;
      {renderConfigBandwidth()}
    </div>
  );
}

export default (withTranslation()(ThrottlingItemRenderer));
