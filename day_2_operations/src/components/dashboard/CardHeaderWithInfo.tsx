import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import { INITIAL_STATE_INTERFACE } from '../../interfaces/interface';
import styled from 'styled-components';

interface Props {
    text: string;
    IconText?: string | Function;
    className?: string;
}
const CardHeaderWithInfo: React.FC<Props> = ({ text, IconText }) => {
    const targetRef = useRef(null);
    const [openPopover, setOpenPopover] = useState(false);

    const renderPopOver = (hoverInfo: string | Function) => {
        if (!openPopover) {
            return null;
        }
        return (
            <Popover
                placement="bottom"
                isOpen={openPopover}
                target={targetRef}
                style={{
                    borderRadius: '8px',
                    border: 'none',
                }}
            >
                <PopoverBody>{typeof hoverInfo === 'function' ? hoverInfo() : hoverInfo}</PopoverBody>
            </Popover>
        );
    };
    return (
        <>
            <div>
                <Row>
                    <Col sm={6}>
                        <Ptag className="font-weight-medium color-white">{text}</Ptag>
                    </Col>
                    <Col sm={6}>
                        {IconText ? (
                            <IconDiv className="text-end">
                                <>
                                    <i className="fas fa-sm fa-info-circle info__icon" ref={targetRef} id={`icon-dashboard-${text.replace(' ', '')}`} onMouseEnter={() => setOpenPopover(true)} onMouseLeave={() => setOpenPopover(false)} />
                                    {renderPopOver(IconText)}
                                </>
                            </IconDiv>
                        ) : null}
                    </Col>
                </Row>
            </div>
            <hr style={{ margin: '6px' }} />
        </>
    );
};

const IconDiv = styled.div`
    font-size: 15px;
    @media (max-width: 1512px) {
        font-size: 10px;
    }
`;

const Ptag = styled.p`
    font-size: 15px;
    margin: 0px;
    width: 80%;
    @media (max-width: 1512px) {
        font-size: 13px;
    }
    @media (max-width: 1347px) {
        font-size: 10px;
    }
    @media (max-width: 1105px) {
        font-size: 8px;
    }
`;

const mapStateToProps = (state: INITIAL_STATE_INTERFACE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(CardHeaderWithInfo));
