import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';

const DropdownActions = (props) => {
  const { actions, dispatch, t, className, uniqueID = 'unique-dropdown-action-id' } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const { title } = props;
  function onActionClick(item) {
    const { action, id } = item;
    dispatch(action(id));
  }

  return (
    <div className={className || 'display__flex__reverse'}>
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        className="d-inline-block"
      >
        <DropdownToggle>
          <span id={uniqueID} className="d-none d-xl-inline-block ml-2 mr-1">
            {title}
          </span>
          <FontAwesomeIcon style={{ fontSize: '8px', padding: '1px' }} size="xs" icon={faChevronDown} onClick={toggle} />
        </DropdownToggle>
        <DropdownMenu right>
          {actions.map((item) => {
            const { label, disabled, icon } = item;
            const labelID = label.replaceAll(' ', '');
            return (
              <DropdownItem right onClick={() => onActionClick(item)} disabled={disabled} className={!disabled ? 'text-white' : ''}>
                <FontAwesomeIcon size="sm" icon={icon} id={`${labelID}`} />
                &nbsp;&nbsp;
                {t(label)}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
export default (withTranslation()(DropdownActions));
