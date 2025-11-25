import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Form, Label } from 'reactstrap';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { getValue } from '../../utils/appUtils';
import { valueChange } from '../../store/reducers/userReducer';

interface Props {
    user: UserInterface;
    fieldkey: string;
    dispatch: any;
}

const RadioOption: React.FC<Props> = ({ user, fieldkey, dispatch }) => {
    const { values } = user;
    const selectedValue = getValue(fieldkey, values) || 'workloadView';
    const lavel = getValue(STATIC_KEYS.GLOBAL_SITE_KEY, values) || '1';
    const totalVMs = useSelector((state: any) => state.dashboard.titles.vms) || 0;
    const totalPlans = useSelector((state: any) => state.dashboard.titles.protectionPlans) || 0;

    const handleChange = (newValue: string) => {
        dispatch(valueChange([fieldkey, newValue]));
    };

    return (
        <Form className="text-muted pt-2 dash_radio_button_font_size">
            <div className="form-check-inline">
                <input type="radio" className="form-check-input" id={`${fieldkey}-vms-option`} name={`${fieldkey}-jobsType`} value="workloadView" checked={selectedValue === 'workloadView'} onChange={() => handleChange('workloadView')} />
                <Label className="form-check-label" for={`${fieldkey}-vms-option`}>
                    {`Protected Machines (${totalVMs})`}
                </Label>
            </div>

            {lavel === '1' && (
                <div className="form-check-inline">
                    <input type="radio" className="form-check-input" id={`${fieldkey}-plan-option`} name={`${fieldkey}-jobsType`} value="planView" checked={selectedValue === 'planView'} onChange={() => handleChange('planView')} />
                    <Label className="form-check-label" for={`${fieldkey}-plan-option`}>
                        {`Protection Plans (${totalPlans})`}
                    </Label>
                </div>
            )}
        </Form>
    );
};

const mapStateToProps = (state: INITIAL_STATE_INTERFACE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(RadioOption));
