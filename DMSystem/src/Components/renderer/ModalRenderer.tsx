import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'reactstrap';
import { ModalData, ModalOptions } from '../../interfaces/interfaces';
import { ACTIVITIES_MODAL } from '../../Constants/ModalConstant';
import ActivitiesInfoModal from '../../pages/upgrade/ActivitiesModal';
import { closeModal } from '../../store/actions/ModalActions';

// Define props for the component
interface DMModalProps {
    modal: ModalData;
    dispatch: (action: any) => void; // Replace with a specific type if available
    user: any; // Replace `any` with a more specific type if you have one
}

const ModalRenderer: React.FC<DMModalProps> = ({ modal, dispatch }) => {
    const { show, options, content } = modal;
    const { css, size, floatModalRight, width, modalActions } = options;

    if (!show || !modal || Object.keys(modal).length === 0) {
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
        dispatch(closeModal());
    };

    const renderContent = (options: ModalOptions) => {
        // Replace this with your actual content rendering logic
        switch (content) {
            case ACTIVITIES_MODAL:
                return <ActivitiesInfoModal data={options?.data} dispatch={dispatch} />;

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
                        <div className="modal-header">
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
                    <div className="modal-header">
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
