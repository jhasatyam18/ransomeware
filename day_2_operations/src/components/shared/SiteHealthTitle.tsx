import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Popover, PopoverBody } from 'reactstrap';
import { INITIAL_STATE_INTERFACE } from '../../interfaces/interface';

interface Props {
    text: string;
    IconText?: string | Function;
    className?: string;
    params?: any[];
}
const SiteHealthTitle: React.FC<Props> = ({ text, IconText, params = [] }) => {
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
                <PopoverBody>{typeof hoverInfo === 'function' ? hoverInfo(...params) : hoverInfo}</PopoverBody>
            </Popover>
        );
    };
    return (
        <>
            <div>
                {text}
                {IconText ? (
                    <>
                        <i className="fas fa-xsm fa-info-circle ms-3 mt-1" ref={targetRef} id={`icon-dashboard-${text.replace(' ', '')}`} onMouseEnter={() => setOpenPopover(true)} onMouseLeave={() => setOpenPopover(false)} />
                        {renderPopOver(IconText)}
                    </>
                ) : null}
            </div>
        </>
    );
};

const mapStateToProps = (state: INITIAL_STATE_INTERFACE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(SiteHealthTitle));
