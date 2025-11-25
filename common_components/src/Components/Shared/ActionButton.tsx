import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
interface Props {
    label: string;
    isDisabled?: boolean;
    cssName?: string;
    onClick?: () => void;
    icon?: any;
}

export const ActionButton: React.FC<Props> = (props) => {
    const { label, onClick, isDisabled, cssName, icon } = props;
    let btnCss = 'btn btn-secondary btn-sm margin-right-2 ';
    if (cssName !== '' && typeof cssName !== 'undefined') {
        btnCss = cssName;
    }
    return (
        <button type="button" className={btnCss} onClick={onClick} disabled={isDisabled}>
            <FontAwesomeIcon size="sm" icon={icon} />
            &nbsp;&nbsp;
            {label}
        </button>
    );
};
