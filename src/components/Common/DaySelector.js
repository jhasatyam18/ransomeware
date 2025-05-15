import React, { useEffect, useState } from 'react';
import { valueChange } from '../../store/actions';
import { getValue } from '../../utils/InputUtils';

const DaySelector = (props) => {
  const { user, options, defaultSelected = null, dispatch, fieldkey } = props;
  const [selected, setSelected] = useState(['Sunday']);
  const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fieldValue = getValue(fieldkey, user.values) || '';
    if (Array.isArray(fieldValue) && fieldValue.length > 0) {
      const indexes = fieldValue.map((day) => dayMap.indexOf(day)).filter((i) => i !== -1);
      setSelected(indexes);
    } else if (Array.isArray(defaultSelected)) {
      const initialSelected = defaultSelected
        .map((day) => options.indexOf(day))
        .filter((i) => i !== -1);
      setSelected(initialSelected);
      const selectedDays = initialSelected.map((i) => dayMap[i]);
      dispatch(valueChange(fieldkey, selectedDays));
    } else {
      const sundayIndex = 0;
      setSelected([sundayIndex]);
      dispatch(valueChange(fieldkey, [dayMap[sundayIndex]]));
    }
  }, []);

  const toggleDay = (index) => {
    let updated;
    if (selected.includes(index)) {
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
    const selectedDays = updated.map((i) => dayMap[i]);
    dispatch(valueChange(fieldkey, selectedDays));
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {options.map((day, idx) => {
        const isSelected = selected.includes(idx);
        return (
          <button
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
