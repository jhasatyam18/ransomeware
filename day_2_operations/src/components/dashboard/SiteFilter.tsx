import React, { useEffect, useState } from 'react';
import { Input, Row } from 'reactstrap';
import { UserInterface } from '../../interfaces/interface';
import { valueChange } from '../../store/reducers/userReducer';
import { AppDispatch } from '../../store';

interface FieldOption {
    label: string;
    value: string;
}
type FieldOptions = FieldOption[] | ((user: UserInterface, fieldKey: string) => FieldOption[]);

interface Field {
    options: FieldOptions;
    type: string;
}

interface SelectProps {
    field: Field;
    fieldKey: string;
    user: UserInterface;
    dispatch: AppDispatch;
}
const SiteFilter: React.FC<SelectProps> = ({ field, fieldKey, user, dispatch }) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        dispatch(valueChange([fieldKey, '1']));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const { dispatch, fieldKey, user, field } = this.props;
        // const { onChange } = field;
        // setValue({
        //   value: e.target.value,
        // });
        dispatch(valueChange([fieldKey, e.target.value]));
        // if (typeof onChange === 'function') {
        // dispatch(onChange({ value: e.target.value, dispatch, user, fieldKey }));
        // }
        // validateField(field, fieldKey, e.target.value, dispatch, user);
        setValue(e.target.value);
    };

    const getOptions = () => {
        const { options } = field;
        let optionValues = [];
        if (typeof options === 'function') {
            optionValues = options(user, fieldKey);
            return optionValues;
        }
        optionValues = options && options.length > 0 ? options : [];
        return optionValues;
    };

    function renderOptions() {
        const options = getOptions();
        return options.map((op: any) => {
            const { value, label } = op;
            return (
                <option key={`${label}-${value}`} value={value}>
                    ✅{label}
                </option>
            );
        });
    }
    return (
        <Row>
            <Input type="select" style={{ border: '1px solid silver' }} id="header-dropdown" onSelect={handleChange} className={`form-control form-control-sm custom-select`} onChange={handleChange} value={value}>
                {renderOptions()}
            </Input>
        </Row>
    );
};
export default SiteFilter;
