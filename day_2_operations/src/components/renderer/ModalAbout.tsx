import React from 'react';
import { useDispatch } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { closeModal } from '../../store/reducers/ModalReducer';

const ModalAbout: React.FC<any> = ({ user }) => {
    const dispatch = useDispatch();

    const onClose = () => {
        dispatch(closeModal());
    };

    const { license } = user;
    const { version, service } = license || {};

    const info = [
        { label: 'Version', value: version || '-' },
        { label: 'Service Name', value: service || '-' },
    ];

    return (
        <>
            <div className="modal-body">
                <div className="container">
                    {info.map((item, idx) => (
                        <Row className="padding-bottom-5" key={idx}>
                            <Col sm={4}>{item.label}</Col>
                            <Col sm={8}>
                                <p>{item.value}</p>
                            </Col>
                        </Row>
                    ))}
                </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Close
                </button>
            </div>
        </>
    );
};

export default ModalAbout;
