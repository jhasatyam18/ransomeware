import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { valueChange } from '../../store/reducers/userReducer';
import { useDispatch } from 'react-redux';
import { UserInterface } from '../../interfaces/interface';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { WithTranslation, withTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';

interface FieldOption {
    label: string;
    value: string;
}

type FieldOptions = FieldOption[] | ((user: UserInterface, fieldKey: string) => FieldOption[]);

interface Props extends WithTranslation {
    options: FieldOptions;
    icon: IconDefinition;
    checkbox?: boolean;
    fieldkey: string;
    user: UserInterface;
    onApply?: (selectedSiteIds: string[]) => void;
}

const SiteSelectionDropdown: React.FC<Props> = ({ options, icon, checkbox = false, fieldkey, user, t, onApply }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [unselectedValues, setUnselectedValues] = useState<string[]>(() => {
        // restore persisted values for this field if available
        const saved = localStorage.getItem(`unselected-${fieldkey}`);
        return saved ? JSON.parse(saved) : [];
    });
    const unselectedRef = useRef<string[]>(unselectedValues);
    const dispatch = useDispatch();
    const toggle = () => setDropdownOpen((prev) => !prev);

    // memoize resolvedOptions so it's not recomputed every render
    const resolvedOptions: FieldOption[] = useMemo(() => {
        return typeof options === 'function' ? options(user, fieldkey) : options;
    }, [options, user, fieldkey]);

    // keep ref & localStorage in sync
    useEffect(() => {
        unselectedRef.current = unselectedValues;
        localStorage.setItem(`unselected-${fieldkey}`, JSON.stringify(unselectedValues));
    }, [unselectedValues, fieldkey]);

    const handleCheckboxChange = (value: string) => {
        setUnselectedValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    };

    const handleApply = () => {
        const selectedValues = resolvedOptions.map((opt) => opt.value).filter((value) => !unselectedValues.includes(value));
        onApply?.(selectedValues);
        toggle();
    };

    const handleClick = (value: string) => {
        dispatch(valueChange([fieldkey, value]));
        toggle();
    };

    // ✅ Only renders dropdowns for checkbox or normal mode
    if (checkbox) {
        return (
            <Dropdown id={`filter-multi-site-${fieldkey}`} isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret color="" className="chart_dropdown_icon_size btn graph__dropdown__col__filter">
                    <FontAwesomeIcon size="lg" icon={icon} />
                </DropdownToggle>
                <DropdownMenu style={{ marginLeft: '-55px' }} right>
                    <SimpleBar style={{ maxHeight: '170px' }}>
                        {resolvedOptions.map((opt) => (
                            <DropdownItem key={`${fieldkey}-${opt.value}`} toggle={false}>
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" id={`checkbox-${fieldkey}-${opt.value}`} className="custom-control-input" checked={!unselectedValues.includes(opt.value)} onChange={() => handleCheckboxChange(opt.value)} />
                                    <label className="custom-control-label" htmlFor={`checkbox-${fieldkey}-${opt.value}`} style={{ paddingLeft: '8px' }}>
                                        {opt.label}
                                    </label>
                                </div>
                            </DropdownItem>
                        ))}
                        <DropdownItem divider />
                        <DropdownItem toggle={false}>
                            <button onClick={handleApply} className="btn btn-link">
                                {t('apply.filter')}
                            </button>
                        </DropdownItem>
                    </SimpleBar>
                </DropdownMenu>
            </Dropdown>
        );
    }

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret style={{ border: '1px solid grey' }} color="" className="chart_dropdown_icon_size">
                <FontAwesomeIcon size="lg" icon={icon} />
            </DropdownToggle>
            <DropdownMenu style={{ marginLeft: '-55px' }}>
                {resolvedOptions.map((opt) => (
                    <DropdownItem key={opt.label} onClick={() => handleClick(opt.value)}>
                        {opt.label}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};

export default withTranslation()(SiteSelectionDropdown);
