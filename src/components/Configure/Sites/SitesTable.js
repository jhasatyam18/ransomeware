import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import DMTable from '../../Table/DMTable';
import { TABLE_HEADER_SITES } from '../../../constants/TableConstants';
import { handleSiteTableSelection, selectAllSites } from '../../../store/actions/SiteActions';
import SiteActionBar from './SiteActionBar';

class SitesTable extends Component {
  render() {
    const { sites, dispatch, user } = this.props;
    if (!sites && !sites.sites) { return null; }
    const data = (sites && sites.sites ? sites.sites : []);
    const { selectedSites } = sites;
    return (
      <>
        <Row>
          <Col><SiteActionBar user={user} dispatch={dispatch} selectedSites={selectedSites} {...this.props} /></Col>
        </Row>
        <DMTable
          dispatch={dispatch}
          columns={TABLE_HEADER_SITES}
          data={data}
          isSelectable
          onSelect={handleSiteTableSelection}
          selectedData={selectedSites}
          primaryKey="id"
          name="sites"
          onSelectAll={selectAllSites}
        />

      </>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sites: PropTypes.any.isRequired,
  user: PropTypes.object.isRequired,
};
SitesTable.propTypes = propTypes;

export default SitesTable;
