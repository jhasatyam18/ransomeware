import React, { useState } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { openWizard } from '../../store/actions/WizardActions';
import { DROP_DOWN_ACTION_TYPES } from '../../constants/InputConstants';
import { openModal } from '../../store/actions/ModalActions';

const DropdownActions = (props) => {
  const { actions, dispatch } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const { title } = props;
  function onActionClick(item) {
    const { action, id, type, options, MODAL_COMPONENT, wizard, init, initValue } = item;
    if (init && initValue) {
      dispatch(init(initValue));
    }
    if (type && type === DROP_DOWN_ACTION_TYPES.MODAL) {
      dispatch(openModal(MODAL_COMPONENT, options));
      return;
    }
    if (type && type === DROP_DOWN_ACTION_TYPES.WIZARD) {
      dispatch(openWizard(wizard.options, wizard.steps));
      return;
    }
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
              <DropdownItem right onClick={() => onActionClick(item)} disabled={disabled}>
                {label}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
export default DropdownActions;
