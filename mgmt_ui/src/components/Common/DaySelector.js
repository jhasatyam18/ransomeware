import React, { useEffect, useState } from 'react';
import { valueChange } from '../../store/actions';
import { getValue } from '../../utils/InputUtils';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import { DAYS_CONSTANT } from '../../constants/InputConstants';

const DaySelector = (props) => {
  const { user, options, defaultSelected = null, dispatch, fieldkey, occurenceKey = STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE } = props;
  const [selected, setSelected] = useState([0]);
  const occurrence = getValue(occurenceKey, user.values) || 1;

  useEffect(() => {
    const fieldValue = getValue(fieldkey, user.values) || '';
    if (Array.isArray(fieldValue) && fieldValue.length > 0) {
      const indexes = fieldValue.map((day) => DAYS_CONSTANT.indexOf(day)).filter((i) => i !== -1);
      if (occurrence > 1 && indexes.length > 1) {
        // Only one day allowed for occurrence > 1
        setSelected([0]);
        dispatch(valueChange(fieldkey, [DAYS_CONSTANT[0]]));
      } else {
        setSelected(indexes);
      }
    } else if (Array.isArray(defaultSelected)) {
      const initialSelected = defaultSelected
        .map((day) => options.indexOf(day))
        .filter((i) => i !== -1);
      const validIndexes = occurrence > 1 ? [0] : initialSelected;
      setSelected(validIndexes);
      const selectedDays = validIndexes.map((i) => DAYS_CONSTANT[i]);
      dispatch(valueChange(fieldkey, selectedDays));
    } else {
      const sundayIndex = 0;
      setSelected([sundayIndex]);
      dispatch(valueChange(fieldkey, [DAYS_CONSTANT[sundayIndex]]));
    }
  }, [occurrence]);

  const toggleDay = (index) => {
    let updated;
    if (occurrence > 1) {
      updated = [index]; // Only allow one selected day
    } else if (selected.includes(index)) {
      // Deselect
      updated = selected.filter((i) => i !== index);
      if (updated.length === 0) {
        updated = [0]; // Monday
      }
    } else {
      // Select
      updated = [...selected, index];
    }
    setSelected(updated);
    const selectedDays = updated.map((i) => DAYS_CONSTANT[i]);
    dispatch(valueChange(fieldkey, selectedDays));
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {options.map((day, idx) => {
        const isSelected = selected.includes(idx);
        return (
          <button
            id={`${fieldkey}-${idx + 1}`}
            type="button"
            key={`${day}-${idx + 1}`}
            onClick={() => toggleDay(idx)}
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isSelected ? '#34c38f' : '#ccc',
              color: isSelected ? 'white' : '#444',
              fontSize: 12,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              userSelect: 'none',
              transition: 'background-color 0.3s',
            }}
            aria-pressed={isSelected}
            aria-label={`Toggle ${day}`}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;
