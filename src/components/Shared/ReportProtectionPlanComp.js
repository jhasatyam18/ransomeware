import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Label, Row, Tooltip } from 'reactstrap';
import { useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';
import { valueChange } from '../../store/actions';
import { getValue } from '../../utils/InputUtils';
import { STATIC_KEYS } from '../../constants/InputConstants';

function ReportProtectionPlanComp(props) {
  const { t, user, field, hideLabel, fieldKey } = props;
  const { values } = user;
  const [isOpenFilterCol, setIsOpenFilterCol] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { shouldShow, label, options } = field;
  const selectedOpt = getValue(`${fieldKey}-reportfilter-selected-option`, values) || [];
  const dispatch = useDispatch();
  const getOptions = () => (typeof options === 'function' ? options(user, dispatch) : options || []);
  const getShouldShow = () => (typeof shouldShow === 'function' ? shouldShow(user) : false);
  const showDropdown = getShouldShow();
  const optionsArr = getOptions();
  const dropdownRef = useRef(null);

  const handleOptionChange = (option) => {
    let updatedOptions;
    // Handle "All" selection logic
    if (option.value === STATIC_KEYS.ALL) {
      if (selectedOpt.some((opt) => opt.value === STATIC_KEYS.ALL)) {
        updatedOptions = []; // Deselect "All"
      } else {
        updatedOptions = [
          option, // Include "All" option object
          ...optionsArr.filter((opt) => opt.value !== STATIC_KEYS.ALL), // Include all other options except "All"
        ];
      }
    } else if (selectedOpt.some((opt) => opt.value === option.value)) {
      updatedOptions = selectedOpt.filter(
        (opt) => opt.value !== option.value && opt.value !== STATIC_KEYS.ALL, // Deselect the option and "All"
      );
    } else {
      updatedOptions = [...selectedOpt, option]; // Add the selected option
    }
    if (updatedOptions.length === optionsArr.length - 1 && !updatedOptions.some((opt) => opt.value === STATIC_KEYS.ALL)) {
      const allOption = optionsArr.find((opt) => opt.value === STATIC_KEYS.ALL);
      updatedOptions.push(allOption);
    }
    dispatch(valueChange(`${fieldKey}-reportfilter-selected-option`, updatedOptions));
    const isAllSelected = updatedOptions?.some((opt) => opt.value === STATIC_KEYS.ALL);
    let dispatchValue;
    if (fieldKey === STATIC_KEYS.REPORT_PROTECTION_PLAN) {
      dispatchValue = isAllSelected ? STATIC_KEYS.REPORT_LABEL_ALL : updatedOptions.map((opt) => opt.value).join(',');
    } else {
      dispatchValue = isAllSelected ? optionsArr.map((opt) => opt.value).filter((value) => value !== STATIC_KEYS.ALL).join(',') : updatedOptions.map((opt) => opt.value).join(',');
    }
    dispatch(valueChange(fieldKey, dispatchValue));
  };

  const renderLabel = () => {
    if (hideLabel) return null;
    return (
      <Label for="filter-dropdown">
        {t(label)}
      </Label>
    );
  };

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
  const showSelectedOption = () => {
    const key = fieldKey.replaceAll('.', '_');
    if (selectedOpt.length > 0) {
      const selectedOptionExceptAll = selectedOpt.filter((option) => option.value !== STATIC_KEYS.ALL);
      const allSelectedLabels = selectedOptionExceptAll.map((opt) => opt.label).join(', ');
      const displayText = allSelectedLabels.length > 15 ? `${allSelectedLabels.slice(0, 15)}...` : allSelectedLabels;
      return (
        <div>
          <span id={`${key}-tooltip`}>{displayText}</span>
          { allSelectedLabels.length > 15 && (
          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target={`${key}-tooltip`}
            toggle={toggleTooltip}
          >
            {selectedOptionExceptAll.map((opt) => (
              <span key={`${key}`}>
                {opt.label}
                <br />
              </span>
            ))}
          </Tooltip>
          )}
        </div>
      );
    }
    return fieldKey === STATIC_KEYS.REPORT_PROTECTION_PLAN ? t('select.plan') : t('Filter');
  };

  const toggle = () => {
    setIsOpenFilterCol(!isOpenFilterCol);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenFilterCol(false); // Close dropdown if clicked outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!showDropdown) {
    return null;
  }

  return (
    <Row>
      <Col sm={4}>{renderLabel()}</Col>
      <Col sm={hideLabel ? 12 : 7} className="p-0">
        <div
          role="button"
          onClick={() => toggle()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault(); // Prevent scroll on space key
              toggle();
            }
          }}
          className="text-secondary border"
          style={{ width: '220px', cursor: 'pointer' }}
          ref={dropdownRef}
          tabIndex="0"
          aria-label="Toggle dropdown"
        >
          <Dropdown direction="bottom" id={`filter-${fieldKey}`} isOpen={isOpenFilterCol} className="d-inline-block w-100" key="report_protection_plan_dropdown" toggle={() => function et() { }}>
            <DropdownToggle
              className="header-item w-100 d-flex align-items-center justify-content-between"
              id="datagridColFilter"
              tag="button"
              style={{ border: 'none', backgroundColor: 'transparent', maxHeight: '37px' }}
            >
              <span style={{ marginLeft: '5px', textAlign: 'left' }}>
                {showSelectedOption()}
              </span>
              <span>
                <i className="fas fa-chevron-down text-secondary mr-1" />
              </span>
            </DropdownToggle>
            <DropdownMenu onClick={(e) => e.stopPropagation()} style={{ width: '220px', marginBottom: '38px' }}>
              <SimpleBar style={{ maxHeight: '170px' }}>
                {optionsArr.filter((option) => !(optionsArr.length === 2 && option.value === STATIC_KEYS.ALL)).map((option) => (
                  <DropdownItem
                    key={`${fieldKey}`}
                  >
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id={`${fieldKey}-${option.label}`}
                        name={`${fieldKey}-${option.label}`}
                        checked={selectedOpt.some((opt) => opt.value === option.value)}
                        onChange={(e) => handleOptionChange(option, e)}
                      />
                      <label className="custom-control-label" htmlFor={`${fieldKey}-${option.label}`}>
                        {option.label}
                      </label>
                    </div>
                  </DropdownItem>
                ))}
              </SimpleBar>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Col>
    </Row>
  );
}

export default withTranslation()(ReportProtectionPlanComp);
