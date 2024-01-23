import React from 'react';
import DMTable from '../../Table/DMTable';
import { TABLE_USERS } from '../../../constants/TableConstants';
import { handleUserTableSelection } from '../../../store/actions';

const UsersTable = (props) => {
  const { user, dispatch, settings } = props;
  if (!user && !user.users) { return null; }
  const data = (user && user.users ? user.users : []);
  const { selectedUsers } = settings;
  return (
    <>
      <DMTable
        columns={TABLE_USERS}
        data={data}
        primaryKey="id"
        isSelectable
        onSelect={handleUserTableSelection}
        selectedData={selectedUsers}
        dispatch={dispatch}
      />
    </>
  );
};

export default UsersTable;
