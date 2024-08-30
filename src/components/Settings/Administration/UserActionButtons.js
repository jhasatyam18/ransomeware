import React from 'react';
import { withTranslation } from 'react-i18next';
import ActionButton from '../../Common/ActionButton';
import { clearValues, removeUser, valueChange } from '../../../store/actions';
import { openModal } from '../../../store/actions/ModalActions';
import { MODAL_ADD_NEW_USER, MODAL_CONFIRMATION_WARNING, MODAL_RESET_CREDENTIALS } from '../../../constants/Modalconstant';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';
import { showUserActions } from '../../../utils/TableUtils';

const UserActionButtons = (props) => {
  const { t, user, dispatch, selectedUsers, roles } = props;
  const selUser = Object.keys(selectedUsers).length;

  const onAddNewUser = () => {
    const options = { title: t('configure.user'), user: null, isUpdate: false, roles };
    dispatch(clearValues());
    dispatch(openModal(MODAL_ADD_NEW_USER, options));
  };

  const onReconfigureUser = () => {
    const selectedUserKey = Object.keys(selectedUsers);
    const options = { title: t('reconfigure.user'), isUpdate: true, id: selectedUsers[selectedUserKey].id, roles };
    Object.keys(selectedUsers[selectedUserKey]).forEach((key) => {
      dispatch(valueChange(`configureUser.${key}`, selectedUsers[selectedUserKey][key]));
    });
    dispatch(valueChange('configureUser.role', selectedUsers[selectedUserKey].role.name));
    dispatch(openModal(MODAL_ADD_NEW_USER, options));
  };

  const onRemoveUser = () => {
    const selectedUserKey = Object.keys(selectedUsers);
    const options = { title: t('confirmation'), confirmAction: removeUser, message: `Are you sure you want to remove selected user - ${selectedUsers[selectedUserKey].username} ?`, id: selectedUsers[selectedUserKey].id };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const onReset = () => {
    const selectedUserKey = Object.keys(selectedUsers);
    const options = { title: t('reset.credentials'), id: selectedUsers[selectedUserKey].id };
    dispatch(clearValues());
    dispatch(openModal(MODAL_RESET_CREDENTIALS, options));
  };

  return (
    <>
      <div className="btn-group padding-left-20" role="group" aria-label="First group">
        <ActionButton label="New" onClick={onAddNewUser} icon="fa fa-plus" t={t} key="newUserConfiguration" isDisabled={!hasRequestedPrivileges(user, ['user.create'])} />
        <ActionButton label="Edit" onClick={onReconfigureUser} icon="fa fa-edit" t={t} key="addNewUser" isDisabled={(selUser === 0 || selUser > 1) || !hasRequestedPrivileges(user, ['user.edit']) || !showUserActions(selectedUsers)} />
        <ActionButton label="remove" onClick={onRemoveUser} icon="fa fa-trash" t={t} key="removeUser" isDisabled={(selUser === 0 || selUser > 1) || !hasRequestedPrivileges(user, ['user.delete']) || !showUserActions(selectedUsers)} />
        <ActionButton label="Reset Password" onClick={onReset} icon="bx bx-reset fa-lg" t={t} key="resetUserPassword" iconColor="#34c38f" isDisabled={(selUser === 0 || selUser > 1) || !hasRequestedPrivileges(user, ['user.resetpassword']) || !showUserActions(selectedUsers)} />
      </div>
    </>
  );
};

export default (withTranslation()(UserActionButtons));
