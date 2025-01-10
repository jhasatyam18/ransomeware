import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import { withRouter, useHistory } from 'react-router-dom';
import { CHANGE_ROUTE } from '../../constants/InputConstants';

const DropdownActions = (props) => {
  const history = useHistory();
  const { actions, dispatch, t, align, css, alignLeft, uniqueID = 'unique-dropdown-action-id' } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const { title } = props;
  function onActionClick(item) {
    const { action, id, routePath } = item;
    if (action === CHANGE_ROUTE) {
      history.push(routePath);
      return;
    }
    dispatch(action(id));
  }

  const renderLeft = () => (
    <DropdownMenu style={{ right: 0, left: 'auto', minWidth: '215px' }}>
      {actions.map((item) => {
        const { label, disabled, icon, id } = item;
        const labelID = label.replaceAll(' ', '');
        return (
          <DropdownItem right id={id || `dropdownItem-${labelID}`} onClick={() => onActionClick(item)} disabled={disabled} className={!disabled ? 'text-white' : ''}>
            <FontAwesomeIcon size="sm" icon={icon} id={`${labelID}`} />
            &nbsp;&nbsp;
            {t(label)}
          </DropdownItem>
        );
      })}
    </DropdownMenu>
  );

  const renderRight = () => (
    <DropdownMenu right>
      {actions.map((item) => {
        const { label, disabled, icon, id } = item;
        const labelID = label.replaceAll(' ', '');
        return (
          <DropdownItem right id={id || `dropdownItem-${labelID}`} onClick={() => onActionClick(item)} disabled={disabled} className={!disabled ? 'text-white' : ''}>
            <FontAwesomeIcon size="sm" icon={icon} id={`${labelID}`} />
            &nbsp;&nbsp;
            {t(label)}
          </DropdownItem>
        );
      })}
    </DropdownMenu>
  );

  return (
    <div className={`${align === 'left' ? '' : 'display__flex__reverse'} ${css}`}>
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        className={`d-inline-block ${uniqueID}`}
      >
        <DropdownToggle>
          <span className="d-none d-xl-inline-block ml-2 mr-1">
            {title}
          </span>
          <FontAwesomeIcon style={{ fontSize: '8px', padding: '1px' }} size="xs" icon={faChevronDown} onClick={toggle} />
        </DropdownToggle>
        {alignLeft === 0 ? renderLeft() : renderRight()}
      </Dropdown>
    </div>
  );
};
export default (withTranslation()(withRouter(DropdownActions)));
