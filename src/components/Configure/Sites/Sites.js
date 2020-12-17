import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle, Container,
} from 'reactstrap';
import { fetchSites } from '../../../store/actions/SiteActions';
import SitesTable from './SitesTable';

// Import Images
class Sites extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSites());
  }

  render() {
    const { sites, dispatch, user } = this.props;

    return (
      <>
        <>
          <Container fluid>
            <Card>
              <CardBody>
                <CardTitle className="mb-4">Configured Sites</CardTitle>
                <SitesTable user={user} sites={sites} dispatch={dispatch} />
              </CardBody>
            </Card>

          </Container>
        </>
      </>
    );
  }
}

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sites: PropTypes.any.isRequired,
  user: PropTypes.object.isRequired,
};
Sites.propTypes = propTypes;

export default Sites;
