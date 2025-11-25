import React from 'react';
import SimpleBar from 'simplebar-react';
import { closeModal } from '../../store/actions/ModalActions';

function ModalShowResetedVms(props) {
  const { options, dispatch } = props;
  const { targetNames, note } = options;

  const onReset = () => {
    const { reduxAction, reduxArgs } = options;
    dispatch(reduxAction(reduxArgs));
  };

  const onClose = () => {
    dispatch(closeModal());
  };
  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>Close </button>
      <button type="button" className="btn btn-danger" onClick={onReset}>Reset</button>
    </div>
  );

  const renderNote = () => {
    if (targetNames && targetNames.length > 0 && note) {
      return (
        <div>
          <p className="text-warning">{note}</p>
          <div className="text ">
            &nbsp;&nbsp;
            {targetNames.join(', ')}
          </div>
          <br />
        </div>
      );
    }
  };
  return (
    <div className="modal-body noPadding">
      <SimpleBar className="max-h-400">
        <div className="summary-container">
          {renderNote()}
        </div>
      </SimpleBar>

      {renderFooter()}
    </div>
  );
}

export default ModalShowResetedVms;
