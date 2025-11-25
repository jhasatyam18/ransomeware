import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { closeModal } from '../../store/reducers/ModalReducer';
import { INITIAL_STATE_INTERFACE, ModalData, UserInterface } from '../../interfaces/interface';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ModalProps extends WithTranslation {
    dispatch: ThunkDispatch<INITIAL_STATE_INTERFACE, undefined, AnyAction>;
    user: UserInterface;
    modal: ModalData;
}

const ConfirmationModal: React.FC<ModalProps> = ({ modal, user, dispatch, t }) => {
    // const history = useHistory();
    // const { t } = useTranslation();
    const { options } = modal;

    const onClose = () => {
        dispatch(closeModal());
    };

    const onConfirm = () => {
        if (options.confirmAction) {
            dispatch(options.confirmAction(options.id || ''));
        }
    };

    // const modalItemRenderer = () => {
    //   if (options.render) {
    //     return getItemRendererComponent({ render: options.render, user, dispatch, options });
    //   }
    //   return null;
    // };

    const renderFooter = () => {
        if (options.footerComponent) {
            return options.footerComponent();
        }

        return (
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    {t('Close')}
                </button>
                {options.footerLabel ? (
                    <button type="button" className={`btn btn-${options.color || 'secondary'}`} onClick={onConfirm}>
                        {options.footerLabel}
                    </button>
                ) : (
                    <button type="button" className="btn btn-danger" onClick={onConfirm}>
                        {t('Confirm')}
                    </button>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="modal-body noPadding">
                <div className="container padding-20">
                    <div className="row">
                        {!options.component ? (
                            <>
                                <div className="col-sm-1 confirmation-icon">
                                    <FontAwesomeIcon className="text-warning" size="lg" icon={faExclamationTriangle} />
                                </div>
                                <div className="col-sm-10 confirmation_modal_msg">
                                    {options.message}
                                    {/* {modalItemRenderer()} */}
                                </div>
                            </>
                        ) : (
                            <div className="text-center width-100 confirmation_modal_msg">{options.component ? options.component() : options.message}</div>
                        )}
                    </div>
                </div>
            </div>
            {renderFooter()}
        </>
    );
};

//   export default ConfirmationModal;
export default withTranslation()(ConfirmationModal);
