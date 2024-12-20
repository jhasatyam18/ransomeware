import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
    label: string;
    isDisabled?: boolean;
    cssName?: string;
    onClick?: () => void;
}

const ActionButton: React.FC<Props> = (props) => {
    const { label, onClick, isDisabled, cssName } = props;
    let btnCss = 'btn btn-secondary btn-sm margin-right-2';
    if (cssName !== '' && typeof cssName !== 'undefined') {
        btnCss = cssName;
    }
    return (
        <button type="button" className={btnCss} onClick={onClick} disabled={isDisabled}>
            {label}
        </button>
    );
};
export default withTranslation()(ActionButton);
