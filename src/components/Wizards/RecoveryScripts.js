import React, { Component } from 'react';
import { Label } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { TABLE_PRE_POST_SCRIPT } from '../../constants/TableConstants';
import { getValue } from '../../utils/InputUtils';

class RecoveryScripts extends Component {
  render() {
    const { dispatch, user } = this.props;
    const { values } = user;
    const selectedVMs = getValue('ui.site.seletedVMs', values);
    const data = [];
    Object.keys(selectedVMs).forEach((key) => { data.push(selectedVMs[key]); });
    return (
      <>
        <br />
        <Label>Pre and post recovery script configuration</Label>
        <DMTable
          dispatch={dispatch}
          columns={TABLE_PRE_POST_SCRIPT}
          data={data}
          primaryKey="moref"
          user={user}
        />
      </>
    );
  }
}

export default RecoveryScripts;
