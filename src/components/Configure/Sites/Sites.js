import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Card, CardBody, Container,
} from 'reactstrap';
import { fetchSites } from '../../../store/actions/SiteActions';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
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
                <DMBreadCrumb links={[{ label: 'sites', link: '#' }]} />
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

export default (withTranslation()(Sites));
