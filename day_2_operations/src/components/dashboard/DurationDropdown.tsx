import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { valueChange } from '../../store/reducers/userReducer';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Theme, UserInterface } from '../../interfaces/interface';
import DMDatePicker from '../shared/DMDatePicker';
import { setMinDateForGraphFilter } from '../../utils/appUtils';
import { APPLICATION_THEME, THEME_CONSTANT } from '../../constants/userConstant';
import { getValue } from '../../utils/apiUtils';

interface FieldOption {
    label: string;
    value: string;
}
type FieldOptions = FieldOption[] | ((user: UserInterface, fieldKey: string) => FieldOption[]);
interface Props {
    options: FieldOptions;
    icon: IconDefinition;
    fieldkey: string;
    user: UserInterface;
    onChange?: (value: string) => void;
    onApplyCustomRange?: () => void;
}

const DurationDropdown: React.FC<Props> = ({ options, icon, fieldkey, user, onChange, onApplyCustomRange }) => {
    const { values } = user;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showCustomPopup, setShowCustomPopup] = useState(false);
    const [localStart, setLocalStart] = useState<string | null>(null);
    const [localEnd, setLocalEnd] = useState<string | null>(null);
    const [hasPendingChange, setHasPendingChange] = useState(false);
    const dispatch = useDispatch();
    const justSelectedRef = useRef(false);
    const resolvedOptions: FieldOption[] = typeof options === 'function' ? options(user, fieldkey) : options;
    const startDate = { label: 'Start Date', maxDate: true };
    const endDate = { label: 'End Date', maxDate: true, minDate: () => setMinDateForGraphFilter({ user, key: `${fieldkey}.stack.bar.duration.startDate` }) };
    const theme = getValue({ key: APPLICATION_THEME, values }) as Theme;

    const toggle = () => {
        if (justSelectedRef.current) {
            justSelectedRef.current = false; // reset flag
            return;
        }
        setDropdownOpen((prevState) => !prevState);
    };

    const openCustomPopup = () => {
        const startFromRedux = getValue({ key: `${fieldkey}.stack.bar.duration.startDate`, values: user.values });
        const endFromRedux = getValue({ key: `${fieldkey}.stack.bar.duration.endDate`, values: user.values });
        setLocalStart(startFromRedux || null);
        setLocalEnd(endFromRedux || null);
        setShowCustomPopup(true);
        setHasPendingChange(false);
    };

    const handleClick = (value: string) => {
        if (value === '0') {
            // setShowCustomPopup(true);
            openCustomPopup();
            return;
        }
        justSelectedRef.current = true;
        toggle();
        dispatch(valueChange([fieldkey, value]));
        if (onChange) {
            onChange(value);
        }
    };

    const handleCustomApply = () => {
        if (onChange) onChange('custom');
        if (onApplyCustomRange) onApplyCustomRange();
        setDropdownOpen(false);
        setShowCustomPopup(false);
        setHasPendingChange(false);
    };

    const handleCancel = () => {
        if (hasPendingChange) {
            if (localStart) {
                dispatch(valueChange([`${fieldkey}.stack.bar.duration.startDate`, localStart]));
            }
            if (localEnd) {
                dispatch(valueChange([`${fieldkey}.stack.bar.duration.endDate`, localEnd]));
            }
        }
        setShowCustomPopup(false);
        setHasPendingChange(false);
    };

    useEffect(() => {
        if (showCustomPopup) {
            setHasPendingChange(true);
        }
    }, [user.values]);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret style={{ border: '1px solid grey' }} color="" className="chart_dropdown_icon_size graph__dropdown__col__filter">
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
            {showCustomPopup && (
                <div style={{ position: 'absolute', top: '100%', left: -150, zIndex: 1050, background: THEME_CONSTANT.CUSTOM_DURATION?.[theme || 'dark'], padding: '8px', borderRadius: '6px', marginTop: '4px', minWidth: '270px', boxShadow: '0px 8px 20px rgba(0,0,0,0.25)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <DMDatePicker dispatch={dispatch} user={user} field={startDate} fieldKey={`${fieldkey}.stack.bar.duration.startDate`} />
                        <DMDatePicker dispatch={dispatch} user={user} field={endDate} fieldKey={`${fieldkey}.stack.bar.duration.endDate`} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button style={{ marginRight: '8px' }} className="btn btn-sm btn-secondary" onClick={() => handleCancel()}>
                            Close
                        </button>
                        <button className="btn btn-sm btn-success" onClick={() => handleCustomApply()}>
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DurationDropdown;
