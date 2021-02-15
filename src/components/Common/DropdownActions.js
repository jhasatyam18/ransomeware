import React, { useState } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';

const DropdownActions = (props) => {
  const { actions, dispatch, t } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const { title } = props;
  function onActionClick(item) {
    const { action, id } = item;
    dispatch(action(id));
  }

  return (
    <div className="display__flex__reverse">
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        className="d-inline-block"
      >
        <DropdownToggle>
          <span className="d-none d-xl-inline-block ml-2 mr-1">
            {title}
          </span>
          <i className="bx bx-chevron-down" />
        </DropdownToggle>
        <DropdownMenu right>
          {actions.map((item) => {
            const { label, disabled } = item;
            return (
              <DropdownItem right onClick={() => onActionClick(item)} disabled={disabled} style={{ color: (!disabled ? 'white' : '') }}>
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
