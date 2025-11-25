import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { JOB_FAILED, JOB_IN_PROGRESS } from '../../../Constants/AppStatus';

interface SupportBundle {
  id: string | number;
  name: string;
  bundleUrl: string;
  status: string;
  [key: string]: any;
}

interface SupportBundleActionsRendererProps extends WithTranslation {
  data: SupportBundle;
  options: any;
}

const SupportBundleActionsRenderer: React.FC<SupportBundleActionsRendererProps> = ({ data, options }) => {
  const deleteSupportBundle = options?.deleteSupportBundle;
  const openModal = options?.openModal;
  const priviledges = options?.priviledges() || undefined;
  const dispatch = useDispatch();

  const onDelete = (): void => {
    const options = {
      title: 'Confirmation',
      confirmAction: deleteSupportBundle,
      message: `Are you sure you want to delete support bundle ${data.name} ?`,
      id: data.id,
    };
    dispatch(openModal({content: 'MODAL_CONFIRMATION_WARNINGp', options}));
  };

  const renderDownload = (): React.ReactNode => {
    const downloadUrl = `${window.location.protocol}//${window.location.host}/dop${data.bundleUrl}`;
    if (data.status === JOB_FAILED || data.status === JOB_IN_PROGRESS) {
      return null;
    }
    return (
      <a href={downloadUrl} >
        <FontAwesomeIcon icon={faDownload} className="text-info" />
      </a>
    );
  };

  const renderDelete = (): React.ReactNode => {
    if (data.status === 'inprogress') {
      return null;
    }
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if(priviledges){
            onDelete();
          }
        }}
        title="Remove"
      >
        <FontAwesomeIcon icon={faTrash} className="text-danger" />
      </a>
    );
  };

  return (
    <div>
      &nbsp;&nbsp;
      {renderDelete()}
      &nbsp;&nbsp;
      {renderDownload()}
    </div>
  );
};

export default withTranslation()(SupportBundleActionsRenderer);
