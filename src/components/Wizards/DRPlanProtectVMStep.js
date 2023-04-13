import React, { Component } from 'react';
import { Label, Container, Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import DMTree from '../Shared/DMTree';
import DMTable from '../Table/DMTable';
import DMTPaginator from '../Table/DMTPaginator';
import { getValue } from '../../utils/InputUtils';
import { TABLE_FILTER_TEXT, TABLE_PROTECT_VM_VMWARE } from '../../constants/TableConstants';
import { handleProtectVMSeletion } from '../../store/actions/SiteActions';
import { PLATFORM_TYPES, STATIC_KEYS } from '../../constants/InputConstants';
import { filterData } from '../../utils/AppUtils';
import { FIELDS } from '../../constants/FieldsConstant';

class DRPlanProtectVMStep extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [], hasFilterString: false, searchData: [] };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  onFilter(criteria) {
    const { user } = this.props;
    const { values } = user;
    const vms = getValue('ui.site.vms', values);
    if (criteria === '') {
      this.setState({ hasFilterString: false, searchData: [] });
    } else {
      const newData = filterData(vms, criteria, TABLE_PROTECT_VM_VMWARE);
      this.setState({ hasFilterString: true, searchData: newData });
    }
  }

  setDataForDisplay(data) {
    this.setState({ dataToDisplay: data });
  }

  render() {
    const { dispatch, user, t } = this.props;
    const { values } = user;
    const { hasFilterString, searchData, dataToDisplay } = this.state;
    const vms = getValue('ui.site.vms', values);
    const data = (hasFilterString ? searchData : vms);
    let selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
    const platfromType = getValue('ui.values.protectionPlatform', values);
    const field = FIELDS['drplan.vms'];
    const id = getValue('ui.values.protectionSiteID', values);
    if (!selectedVMs) {
      selectedVMs = {};
    }
    if (platfromType === PLATFORM_TYPES.VMware) {
      // VirtualMachine
      return (
        <Container fluid className="padding-top-20">
          <Label>{t('Select Virtual Machine for protection')}</Label>
          <DMTree dispatch={dispatch} search searchURL={`api/v1/sites/${id}/vms`} user={user} selectedData={selectedVMs} showSelectedvmdata fieldKey="ui.site.vmware.selectedvms" field={field} selectedVMkey="ui.selectedvm.value" />
        </Container>
      );
    }
    return (
      <Container fluid className="padding-10">
        <Label>{t('Select Virtual Machine for protection')}</Label>
        <Row>
          <Col className="margin-left-30 padding-right-30 margin-right-10">
            <DMTPaginator
              defaultLayout="true"
              data={data}
              setData={this.setDataForDisplay}
              showFilter="true"
              onFilter={this.onFilter}
              columns={TABLE_PROTECT_VM_VMWARE}
              filterHelpText={TABLE_FILTER_TEXT.TABLE_PROTECT_VM_VMWARE}
            />
          </Col>
        </Row>
        <DMTable
          dispatch={dispatch}
          columns={TABLE_PROTECT_VM_VMWARE}
          data={dataToDisplay}
          isSelectable
          onSelect={handleProtectVMSeletion}
          selectedData={selectedVMs}
          primaryKey="moref"
        />
      </Container>
    );
  }
}

export default (withTranslation()(DRPlanProtectVMStep));
