import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'reactstrap';
import { INITIAL_STATE_INTERFACE, ModalData, ModalOptions, UserInterface } from '../../interfaces/interface';
import { modalClose } from '../../store/actions/ModalAction';
import { MODAL_REGISTER_SITE } from '../../constants/siteConnection';
import ModalRegisterSite from './ModalRegisterSite';
import { MODAL_ABOUT, MODAL_CONFIRMATION_WARNING, MODAL_GENERATE_SUPPORT_BUNDLE, MODAL_SUMMARY } from '../../constants/userConstant';
import ConfirmationModal from './ConfirmationModal';
import ModalShowSummary from './ModalShowSummary';
// import { AppDispatch } from '../../store';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import ModalAbout from './ModalAbout';
import ModalSupportBundle from './ModalSupportBundle';

// Define props for the component
interface DMModalProps {
    modal: ModalData;
    dispatch: ThunkDispatch<INITIAL_STATE_INTERFACE, undefined, AnyAction>; // Replace with a specific type if available
    user: UserInterface; // Replace `any` with a more specific type if you have one
}

const ModalRenderer: React.FC<DMModalProps> = ({ modal, dispatch, user }) => {
    const { options, content } = modal;
    const { css, size, floatModalRight, width, modalActions } = options;

    if (!modal || Object.keys(modal).length === 0) {
        return null;
    }

    const renderFooter = () => {
        return (
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Close{' '}
                </button>
            </div>
        );
    };

    const onClose = () => {
        dispatch(modalClose());
    };

    const renderContent = (options: ModalOptions) => {
        switch (content) {
            case MODAL_REGISTER_SITE:
                return <ModalRegisterSite modal={modal} />;
            case MODAL_CONFIRMATION_WARNING:
                return <ConfirmationModal modal={modal} dispatch={dispatch} user={user} />;
            case MODAL_SUMMARY:
                return <ModalShowSummary modal={modal} />;
            case MODAL_ABOUT:
                return <ModalAbout modal={modal} user={user} />;
            case MODAL_GENERATE_SUPPORT_BUNDLE:
                return <ModalSupportBundle modal={modal} user={user} dispatch={dispatch} />;
            default:
                break;
        }
    };

    return (
        <>
            {floatModalRight ? (
                <Modal
                    isOpen
                    className={`${css} slide-in`}
                    style={{
                        margin: '0px',
                        float: 'right',
                        width: `${width || '30%'}`,
                        marginTop: '3px',
                        overflow: 'hidden',
                        background: 'inherit',
                    }}
                    size={size}
                    centered={false}
                >
                    <div style={{ height: '90vh', background: 'inherit', verticalAlign: 'middle' }}>
                        <div className="modal-header justify-content-between">
                            <h4 className="modal-title mt-0" id="dmwizard">
                                {options.title}
                            </h4>
                            <div className="wizard-header-options">
                                <div className="wizard-header-div cursor-pointer">
                                    <box-icon name="x-circle" type="solid" color="white" onClick={onClose} style={{ width: 20, cursor: 'pointer' }} />
                                </div>
                            </div>
                        </div>
                        {renderContent(options)}
                    </div>
                    {renderFooter()}
                </Modal>
            ) : (
                <Modal isOpen centered className={css} size={size}>
                    <div className="modal-header justify-content-between">
                        <h5 className="modal-title mt-0" id="DMMODAL">
                            {options.title}
                        </h5>
                        {modalActions && (
                            <div className="wizard-header-options">
                                <div className="wizard-header-div cursor-pointer">
                                    <FontAwesomeIcon size="lg" icon={faXmarkCircle} onClick={onClose} />
                                </div>
                            </div>
                        )}
                    </div>
                    {renderContent(options)}
                </Modal>
            )}
        </>
    );
};

export default ModalRenderer;
