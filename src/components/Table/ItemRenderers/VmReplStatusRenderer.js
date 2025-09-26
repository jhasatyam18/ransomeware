import { faClone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { KEY_CONSTANTS } from '../../../constants/UserConstant';

const VmReplStatusRenderer = ({ data, t }) => {
  const { replicationStatus } = data;
  if (!data) return null;
  return (
    <div>
      {replicationStatus === KEY_CONSTANTS.DISABLING ? (
        <spna className="text-danger">Stopping</spna>

      ) : (
        <>
          {replicationStatus === KEY_CONSTANTS.DISABLED ? (
            <>
              <FontAwesomeIcon className="text-danger me-2" icon={faClone} />
              {t('no')}
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faClone} className="text-success me-2" />
              {t('yes')}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default withTranslation()(VmReplStatusRenderer);
