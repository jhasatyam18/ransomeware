import React, { useRef } from 'react';
import { Input, Row } from 'reactstrap';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { clearValues, valueChange } from '../../store/reducers/userReducer';
import { openModal } from '../../store/reducers/ModalReducer';
import { MODAL_REGISTER_SITE } from '../../constants/siteConnection';
import { useLocation } from 'react-router-dom';
import { AppDispatch } from '../../store';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getValue } from '../../utils/apiUtils';
import { STATIC_KEYS } from '../../constants/StoreKey';

interface FieldOption {
    label: string;
    value: string;
}

interface SelectProps {
    fieldKey: string;
    user: UserInterface;
    dispatch: AppDispatch;
}

const HeaderDropdown: React.FC<SelectProps> = ({ fieldKey, user, dispatch }) => {
    const { values, activeTab } = user;
    const location = useLocation();
    const navigate = useNavigate();
    const isOnRestrictedPage = location.pathname.includes('/alerts') || location.pathname.includes('/replication') || location.pathname.includes('/recovery') || activeTab === 2;
    const options: FieldOption[] = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values }) || [];
    const fieldValue = getValue({ key: fieldKey, values: user.values }) || '1';
    const dropdownRef = useRef<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === 'register_site') {
            navigate('/dop/sites');
            dispatch(clearValues());
            const options = { title: 'Register New Site', size: 'md', modalActions: true };
            dispatch(openModal({ content: MODAL_REGISTER_SITE, options }));
            return;
        }
        dispatch(valueChange([fieldKey, e.target.value]));
    };

    return (
        <Row>
            <Input type="select" id="header-dropdown" innerRef={dropdownRef} onSelect={handleChange} className={`form-select form-control-sm custom-select global-dropdown`} onChange={handleChange} value={fieldValue}>
                {options.map((op: any, index: any) => {
                    const isDisabled = op.label === 'Global' && isOnRestrictedPage;
                    return (
                        <option key={`${op.label}-${op.value}`} value={op.value} disabled={isDisabled}>
                            {op.label}
                        </option>
                    );
                })}
                <option key={`linkKey`} value="register_site" className="text-primary">
                    Add New Site
                </option>
            </Input>
        </Row>
    );
};

// export default Node;
function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, sites } = state;
    return {
        user,
        sites,
    };
}

export default connect(mapStateToProps)(withTranslation()(HeaderDropdown));
