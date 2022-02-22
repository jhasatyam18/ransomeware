import React, { Component } from 'react';
import { Col, Label, Row, Container } from 'reactstrap';
import DMTable from '../Table/DMTable';
import DMTPaginator from '../Table/DMTPaginator';
import { TABLE_FILTER_TEXT, TABLE_RECOVERY_VMS } from '../../constants/TableConstants';
import { handleProtectVMSeletion, handleSelectAllRecoveryVMs } from '../../store/actions/SiteActions';
import { getValue } from '../../utils/InputUtils';
import { filterData } from '../../utils/AppUtils';

class RecoveryMachines extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [], hasFilterString: false, searchData: [] };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  onFilter(criteria) {
    const { vms } = this.state;
    if (criteria === '') {
      this.setState({ hasFilterString: false, searchData: [] });
    } else {
      const newData = filterData(vms, criteria, TABLE_RECOVERY_VMS);
      this.setState({ hasFilterString: true, searchData: newData });
    }
  }

  setDataForDisplay(data) {
    this.setState({ dataToDisplay: data });
  }

  render() {
    const { dispatch, user } = this.props;
    const { values } = user;
    const { hasFilterString, searchData, dataToDisplay } = this.state;
    const vms = getValue('ui.recovery.vms', values);
    let selectedVMs = getValue('ui.site.seletedVMs', values);
    const data = (hasFilterString ? searchData : vms);
    if (!selectedVMs) {
      selectedVMs = {};
    }
    return (
      <Container fluid className="padding-10">
        <br />
        <Label>Select Virtual Machine for recovery</Label>
        <br />
        <Row>
          <Col className="margin-left-30 padding-right-30 margin-right-10">
            <DMTPaginator
              data={data}
              setData={this.setDataForDisplay}
              showFilter="true"
              onFilter={this.onFilter}
              columns={TABLE_RECOVERY_VMS}
              filterHelpText={TABLE_FILTER_TEXT.TABLE_RECOVERY_VMS}
            />
          </Col>
        </Row>
        <DMTable
          dispatch={dispatch}
          columns={TABLE_RECOVERY_VMS}
          data={dataToDisplay}
          isSelectable
          onSelect={handleProtectVMSeletion}
          selectedData={selectedVMs}
          primaryKey="moref"
          name="recoveryvms"
          onSelectAll={handleSelectAllRecoveryVMs}
          user={user}
        />
      </Container>
    );
  }
}

export default RecoveryMachines;
